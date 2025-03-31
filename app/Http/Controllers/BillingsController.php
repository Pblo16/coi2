<?php

namespace App\Http\Controllers;

use App\Models\Billings;
use App\Models\BillingDetail;
use App\Models\Policies;
use App\Models\Subpolices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BillingsController extends Controller
{
    /**
     * Checks if billing details are balanced (debits equal credits)
     */
    private function isBalanced(array $billingDetails): bool
    {
        $balance = 0;
        foreach ($billingDetails as $detail) {
            $amount = floatval($detail['amount']);
            // Type 0 is debit (cargo), Type 1 is credit (abono)
            $balance += ($detail['type'] == 0) ? $amount : -$amount;
        }

        // Use a small epsilon value to handle floating point rounding errors
        $epsilon = 0.001;
        return abs($balance) < $epsilon;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $headers = [
            ['key' => 'details', "label" => "Details"],
            ['key' => 'account_type_text', "label" => "Account Type"],
        ];

        // Include billingDetails relation in the query
        $billings = Billings::with('billingDetails.policy')->paginate(10);

        return Inertia::render('billings/index', [
            'billings' => $billings,
            'headers' => $headers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get subpolicies for billing details with their parent policies
        $subpolicies = Subpolices::with('policy')->get();
        return Inertia::render('billings/create', [
            'policies' => $subpolicies,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'details' => 'required|string',
            'account_type' => 'required|string|in:ingreso,egreso,diario',
        ]);

        // Check if billing details exist and are balanced
        if (!isset($request->billingDetails) || count($request->billingDetails) < 2) {
            return redirect()->back()->withErrors(['billingDetails' => 'Se requieren al menos dos detalles para una factura balanceada.']);
        }

        // Validate balance on the server side as well
        if (!$this->isBalanced($request->billingDetails)) {
            return redirect()->back()->withErrors(['billingDetails' => 'La cuenta debe estar balanceada. Los cargos deben ser iguales a los abonos.']);
        }

        DB::beginTransaction();

        try {
            $billing = Billings::create($request->only(['details', 'account_type']));

            // Handle billing details if present
            if ($request->has('billingDetails')) {
                foreach ($request->billingDetails as $detail) {
                    if (!empty($detail['policy_id']) && !empty($detail['amount'])) {
                        $billing->billingDetails()->create([
                            'subpolicy_id' => $detail['policy_id'], // Use policy_id from the request, but store as subpolicy_id
                            'amount' => $detail['amount'],
                            'type' => $detail['type'] ?? 0,
                        ]);
                    }
                }
            }

            DB::commit();
            return redirect()->route('billings.index')
                ->with('success', 'Billing created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error creating billing: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Include the parent policy data in the response
        $billing = Billings::with('billingDetails.subpolicy.policy')->findOrFail($id);

        // Transform billing details to map subpolicy to policy for frontend
        $billing->billingDetails = $billing->billingDetails->map(function ($detail) {
            return [
                'id' => $detail->id,
                'amount' => $detail->amount,
                'type' => $detail->type,
                'type_text' => $detail->type_text,
                'policy' => [
                    'id' => $detail->subpolicy->id,
                    'name' => $detail->subpolicy->name,
                    'policy' => $detail->subpolicy->policy ?? null
                ]
            ];
        });

        return Inertia::render('billings/view', [
            'billing' => $billing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Include the parent policy in the loaded data
        $billing = Billings::with('billingDetails.subpolicy.policy')->findOrFail($id);

        // Transform the billing details to ensure consistency with the expected structure
        // Map subpolicy back to policy for frontend compatibility
        $billingDetails = $billing->billingDetails->map(function ($detail) {
            return [
                'id' => $detail->id,
                'policy_id' => $detail->subpolicy_id,  // Map subpolicy_id to policy_id for frontend
                'amount' => $detail->amount,
                'type' => $detail->type,
                'policy' => $detail->subpolicy  // Map subpolicy to policy for frontend
            ];
        });

        // Replace the billingDetails with the transformed version
        $billing->billingDetails = $billingDetails;

        // Get subpolicies that can be used in billing details
        $subpolicies = Subpolices::with('policy')->get();

        return Inertia::render('billings/edit', [
            'billing' => $billing,
            'policies' => $subpolicies,  // We're keeping the variable name 'policies' for frontend compatibility
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Add debug logging at the start
        \Log::info('Update request received', ['data' => $request->all()]);

        $request->validate([
            'details' => 'required|string',
            'account_type' => 'required|string|in:ingreso,egreso,diario',
        ]);

        // Check if billing details exist and are balanced
        if (!isset($request->billingDetails) || count($request->billingDetails) < 2) {
            return redirect()->back()->withErrors(['billingDetails' => 'Se requieren al menos dos detalles para una factura balanceada.']);
        }

        // Validate that subpolicy_ids exist in the subpolices table
        $subpolicyIds = collect($request->billingDetails)->pluck('policy_id')->unique()->toArray();
        $existingSubpolicyIds = Subpolices::whereIn('id', $subpolicyIds)->pluck('id')->toArray();
        $invalidSubpolicyIds = array_diff($subpolicyIds, $existingSubpolicyIds);

        if (!empty($invalidSubpolicyIds)) {
            \Log::error('Invalid subpolicy IDs detected', ['invalidIds' => $invalidSubpolicyIds]);
            return redirect()->back()->withErrors(['billingDetails' => 'Algunas subpolicies seleccionadas no son válidas.']);
        }

        // Normalize billing details types to ensure they're numeric for isBalanced function
        $normalizedDetails = collect($request->billingDetails)->map(function ($detail) {
            return [
                'id' => isset($detail['id']) ? (int)$detail['id'] : null,
                'subpolicy_id' => (int)$detail['policy_id'], // Map policy_id from frontend to subpolicy_id
                'amount' => (float)$detail['amount'],
                'type' => (int)$detail['type'],
            ];
        })->toArray();

        // Log normalized details
        \Log::info('Normalized billing details', ['normalizedDetails' => $normalizedDetails]);

        // Validate balance on the server side
        if (!$this->isBalanced($normalizedDetails)) {
            return redirect()->back()->withErrors(['billingDetails' => 'La cuenta debe estar balanceada. Los cargos deben ser iguales a los abonos.']);
        }

        DB::beginTransaction();

        try {
            $billing = Billings::findOrFail($id);
            $billing->update($request->only(['details', 'account_type']));

            // Handle billing details if present
            if (isset($request->billingDetails) && is_array($request->billingDetails)) {
                // Get IDs of existing details to determine which ones to delete
                $existingIds = $billing->billingDetails()->pluck('id')->toArray();
                \Log::info('Existing detail IDs', ['existingIds' => $existingIds]);

                $updatedIds = collect($normalizedDetails)
                    ->pluck('id')
                    ->filter()
                    ->toArray();
                \Log::info('Updated detail IDs', ['updatedIds' => $updatedIds]);

                // Delete details that are not in the updated list
                $toDelete = array_diff($existingIds, $updatedIds);
                \Log::info('IDs to delete', ['toDelete' => $toDelete]);

                if (!empty($toDelete)) {
                    BillingDetail::whereIn('id', $toDelete)->delete();
                }

                // Process each detail
                foreach ($normalizedDetails as $detail) {
                    $detailData = [
                        'subpolicy_id' => $detail['subpolicy_id'], // Use subpolicy_id instead of policy_id
                        'amount' => $detail['amount'],
                        'type' => $detail['type'],
                    ];

                    if (!empty($detail['id'])) {
                        // Update existing detail
                        \Log::info('Updating detail', ['id' => $detail['id'], 'data' => $detailData]);
                        BillingDetail::where('id', $detail['id'])->update($detailData);
                    } else {
                        // Create new detail
                        \Log::info('Creating new detail', ['data' => $detailData]);
                        $billing->billingDetails()->create($detailData);
                    }
                }
            }

            DB::commit();
            return redirect()->route('billings.index')
                ->with('success', 'Billing updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error updating billing', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()
                ->with('error', 'Error updating billing: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $billing = Billings::findOrFail($id);
            $billing->delete();
            return redirect()->route('billings.index')
                ->with('success', 'Billing deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error deleting billing: ' . $e->getMessage());
        }
    }
}
