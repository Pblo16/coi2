<?php

namespace App\Http\Controllers;

use App\Models\Billings;
use App\Models\BillingDetail;
use App\Models\Policies;
use App\Models\Policy;
use App\Models\Subpolices;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Exception;

class ReportsController extends Controller
{
    /**
     * Show the reports dashboard
     */
    public function index()
    {
        return Inertia::render('reports/index');
    }

    /**
     * Show the general ledger page
     */
    public function generalLedger()
    {
        // Get all policies for the filter dropdown
        $policies = Policies::orderBy('name')->get();

        return Inertia::render('reports/general-ledger', [
            'policies' => $policies
        ]);
    }

    /**
     * Export general ledger to PDF
     */
    public function exportGeneralLedger(Request $request)
    {
        try {
            $startDate = $request->start_date . ' 00:00:00';
            $endDate = $request->end_date . ' 23:59:59';
            $policyId = $request->policy_id !== 'all' ? $request->policy_id : null;

            Log::info('Generating General Ledger report', [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'policy_id' => $policyId
            ]);

            // Query to get the policy accounts and their balances
            $query = BillingDetail::join('billings', 'billing_details.billing_id', '=', 'billings.id')
                ->join('subpolices', 'billing_details.subpolicy_id', '=', 'subpolices.id')
                ->join('policies', 'subpolices.policy_id', '=', 'policies.id')
                ->whereBetween('billings.created_at', [$startDate, $endDate]);

            // Apply policy filter if selected
            if ($policyId) {
                $query->where('policies.id', $policyId);
            }

            // Group by policy and subpolicy to get balances
            $accounts = $query->selectRaw('
                policies.id as policy_id,
                policies.name as policy_name,
                policies.code as policy_code,
                subpolices.id as subpolicy_id,
                subpolices.name as subpolicy_name,
                SUM(CASE WHEN billing_details.type = 0 THEN billing_details.amount ELSE 0 END) as debit_total,
                SUM(CASE WHEN billing_details.type = 1 THEN billing_details.amount ELSE 0 END) as credit_total,
                SUM(CASE WHEN billing_details.type = 0 THEN billing_details.amount ELSE -billing_details.amount END) as balance
            ')
                ->groupBy('policies.id', 'policies.name', 'policies.code', 'subpolices.id', 'subpolices.name')
                ->orderBy('policies.code')
                ->orderBy('subpolices.name')
                ->get();

            $totalDebits = $accounts->sum('debit_total');
            $totalCredits = $accounts->sum('credit_total');

            // Generate PDF
            $pdfService = app('pdf.service');
            return $pdfService->generateGeneralLedgerPdf([
                'accounts' => $accounts,
                'totalDebits' => $totalDebits,
                'totalCredits' => $totalCredits,
                'startDate' => $request->start_date,
                'endDate' => $request->end_date,
                'policyName' => $policyId ? Policies::find($policyId)->name : 'All Policies',
                'date' => now()->format('d/m/Y'),
            ])->stream('general-ledger.pdf');
        } catch (Exception $e) {
            Log::error('Error generating general ledger report', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to generate report: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the account books page
     */
    public function accountBooks()
    {
        // Get all policies and subpolicies for the filter dropdown
        $policies = Policies::orderBy('name')->get();

        $subpolicies = Subpolices::with('policy')
            ->get()
            ->map(function ($subpolicy) {
                return [
                    'id' => $subpolicy->id,
                    'name' => $subpolicy->name,
                    'policy' => $subpolicy->policy ? [
                        'id' => $subpolicy->policy->id,
                        'name' => $subpolicy->policy->name
                    ] : null
                ];
            });

        return Inertia::render('reports/account-books', [
            'policies' => $policies,
            'subpolicies' => $subpolicies
        ]);
    }

    /**
     * Export account books to PDF
     */
    public function exportAccountBooks(Request $request)
    {
        try {
            $startDate = $request->start_date . ' 00:00:00';
            $endDate = $request->end_date . ' 23:59:59';
            $subpolicyId = $request->subpolicy_id;

            if (!$subpolicyId) {
                return redirect()->back()->withErrors(['error' => 'Subpolicy ID is required']);
            }

            $subpolicy = Subpolices::with('policy')->findOrFail($subpolicyId);

            Log::info('Generating Account Books report', [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'subpolicy_id' => $subpolicyId
            ]);

            // Get all transactions for this subpolicy in the date range
            $transactions = BillingDetail::where('subpolicy_id', $subpolicyId)
                ->with(['billing' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }])
                ->whereHas('billing', function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                })
                ->orderBy('created_at')
                ->get();

            // Calculate running balance
            $runningBalance = 0;
            $formattedTransactions = $transactions->map(function ($transaction) use (&$runningBalance) {
                if (!$transaction->billing) {
                    return null; // Skip if billing is null (shouldn't happen with proper whereHas)
                }

                $amount = $transaction->amount;

                if ($transaction->type == 0) { // Debit
                    $runningBalance += $amount;
                } else { // Credit
                    $runningBalance -= $amount;
                }

                return [
                    'date' => $transaction->billing->created_at->format('d/m/Y'),
                    'details' => $transaction->billing->details,
                    'debit' => $transaction->type == 0 ? $amount : 0,
                    'credit' => $transaction->type == 1 ? $amount : 0,
                    'balance' => $runningBalance,
                    'account_type' => $transaction->billing->account_type_text,
                    'billing_id' => $transaction->billing->id
                ];
            })
                ->filter() // Remove any nulls
                ->values(); // Reset array keys

            // Generate PDF
            $pdfService = app('pdf.service');
            return $pdfService->generateAccountBooksPdf([
                'subpolicy' => $subpolicy,
                'transactions' => $formattedTransactions,
                'startDate' => $request->start_date,
                'endDate' => $request->end_date,
                'date' => now()->format('d/m/Y'),
                'totalDebits' => $formattedTransactions->sum('debit'),
                'totalCredits' => $formattedTransactions->sum('credit'),
                'finalBalance' => $runningBalance
            ])->stream('account-books.pdf');
        } catch (Exception $e) {
            Log::error('Error generating account books report', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to generate report: ' . $e->getMessage()]);
        }
    }
}
