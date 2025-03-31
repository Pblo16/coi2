<?php

namespace App\Services;

use App\Models\Billings;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PdfService
{
    /**
     * Generate a PDF for a single billing
     * 
     * @param Billings $billing
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generateBillingPdf(Billings $billing)
    {
        try {
            // Load the billing with its details
            $billing->load('billingDetails.subpolicy.policy');

            // Transform billing details for better display in PDF
            $billingDetails = collect();

            foreach ($billing->billingDetails as $detail) {
                $policyName = $detail->subpolicy ? $detail->subpolicy->name : 'Unknown';
                $parentPolicyName = ($detail->subpolicy && $detail->subpolicy->policy) ?
                    $detail->subpolicy->policy->name :
                    'N/A';

                $billingDetails->push([
                    'id' => $detail->id,
                    'amount' => $detail->amount,
                    'type' => $detail->type,
                    'type_text' => $detail->type_text,
                    'policy_name' => $policyName,
                    'parent_policy_name' => $parentPolicyName,
                    'full_policy_name' => ($parentPolicyName != 'N/A') ?
                        "$parentPolicyName-$policyName" :
                        $policyName
                ]);
            }

            // Calculate totals for the PDF
            $debits = $billing->billingDetails
                ->where('type', 0)
                ->sum('amount');

            $credits = $billing->billingDetails
                ->where('type', 1)
                ->sum('amount');

            Log::info('Generating PDF for billing', [
                'billing_id' => $billing->id,
                'details_count' => $billingDetails->count(),
                'debits' => $debits,
                'credits' => $credits
            ]);

            $pdf = PDF::loadView('pdfs.billing', [
                'billing' => $billing,
                'billingDetails' => $billingDetails,
                'debits' => $debits,
                'credits' => $credits,
                'date' => now()->format('d/m/Y'),
            ]);

            return $pdf;
        } catch (\Exception $e) {
            Log::error('Error generating billing PDF', [
                'billing_id' => $billing->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }

    /**
     * Generate a PDF with multiple billings
     * 
     * @param array|Collection $billings
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generateBillingListPdf($billings)
    {
        try {
            // Load each billing with its details
            foreach ($billings as $billing) {
                $billing->load('billingDetails.subpolicy.policy');
            }

            Log::info('Generating PDF for all billings', [
                'count' => $billings->count(),
            ]);

            $pdf = PDF::loadView('pdfs.billing-list', [
                'billings' => $billings,
                'date' => now()->format('d/m/Y'),
            ]);

            return $pdf;
        } catch (\Exception $e) {
            Log::error('Error generating billing list PDF', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }

    /**
     * Generate a PDF for the general ledger report
     * 
     * @param array $data Report data
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generateGeneralLedgerPdf(array $data)
    {
        try {
            Log::info('Generating General Ledger PDF', [
                'startDate' => $data['startDate'],
                'endDate' => $data['endDate'],
            ]);

            $pdf = PDF::loadView('pdfs.general-ledger', $data);
            $pdf->setPaper('a4', 'landscape');

            return $pdf;
        } catch (\Exception $e) {
            Log::error('Error generating general ledger PDF', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }

    /**
     * Generate a PDF for the account books report
     * 
     * @param array $data Report data
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generateAccountBooksPdf(array $data)
    {
        try {
            Log::info('Generating Account Books PDF', [
                'subpolicy_id' => $data['subpolicy']->id,
                'startDate' => $data['startDate'],
                'endDate' => $data['endDate'],
            ]);

            $pdf = PDF::loadView('pdfs.account-books', $data);

            return $pdf;
        } catch (\Exception $e) {
            Log::error('Error generating account books PDF', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }
}
