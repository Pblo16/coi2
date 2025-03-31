<?php

namespace App\Http\Controllers;

use App\Models\Billings;
use App\Models\BillingDetail;
use App\Models\Policies;
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
        $policies = Policies::all();
        return Inertia::render('billings/create', [
            'policies' => $policies,
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
                            'policy_id' => $detail['policy_id'],
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
        $billing = Billings::with('billingDetails.policy')->findOrFail($id);

        return Inertia::render('billings/view', [
            'billing' => $billing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $billing = Billings::with('billingDetails.policy')->findOrFail($id);

        // Transform the billing details to ensure consistency with the expected structure
        $billingDetails = $billing->billingDetails->map(function ($detail) {
            return [
                'id' => $detail->id,
                'policy_id' => $detail->policy_id,
                'amount' => $detail->amount,
                'type' => $detail->type,
                'policy' => $detail->policy
            ];
        });

        // Replace the billingDetails with the transformed version
        $billing->billingDetails = $billingDetails;

        $policies = Policies::all();

        return Inertia::render('billings/edit', [
            'billing' => $billing,
            'policies' => $policies,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
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
            $billing = Billings::findOrFail($id);
            $billing->update($request->only(['details', 'account_type']));

            // Handle billing details if present
            if ($request->has('billingDetails')) {
                // Get IDs of existing details to determine which ones to delete
                $existingIds = $billing->billingDetails()->pluck('id')->toArray();
                $updatedIds = collect($request->billingDetails)->pluck('id')->filter()->toArray();

                // Delete details that are not in the updated list
                $toDelete = array_diff($existingIds, $updatedIds);
                BillingDetail::whereIn('id', $toDelete)->delete();

                // Update or create details
                foreach ($request->billingDetails as $detail) {
                    if (!empty($detail['id'])) {
                        // Update existing
                        BillingDetail::where('id', $detail['id'])->update([
                            'policy_id' => $detail['policy_id'],
                            'amount' => $detail['amount'],
                            'type' => $detail['type'],
                        ]);
                    } else {
                        // Create new
                        if (!empty($detail['policy_id']) && !empty($detail['amount'])) {
                            $billing->billingDetails()->create([
                                'policy_id' => $detail['policy_id'],
                                'amount' => $detail['amount'],
                                'type' => $detail['type'] ?? 0,
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            return redirect()->route('billings.index')
                ->with('success', 'Billing updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
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
