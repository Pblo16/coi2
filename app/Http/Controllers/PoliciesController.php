<?php

namespace App\Http\Controllers;

use App\Models\Policies;
use App\Models\Subpolices;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PoliciesController extends Controller
{
    //
    public function index()
    {
        $headers = [
            ['key' => 'name', "label" => "Name"],
            ['key' => 'code', "label" => "Code"],
        ];

        $policies = Policies::paginate(10);

        return Inertia::render('policies/index', [
            'policies' => $policies,
            'headers' => $headers,
        ]);
    }

    public function create()
    {
        return Inertia::render('policies/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'code' => 'required',
        ]);

        $policy = Policies::create($request->only(['name', 'code']));

        // Handle subpolicies if present
        if ($request->has('subpolicies')) {
            foreach ($request->subpolicies as $subpolicy) {
                if (!empty($subpolicy['name'])) {
                    $policy->subpolicies()->create([
                        'name' => $subpolicy['name'],
                    ]);
                }
            }
        }

        return redirect()->route('policies.index');
    }

    public function show($id)
    {
        $policy = Policies::findOrFail($id);

        return Inertia::render('policies/view', [
            'policy' => $policy,
        ]);
    }

    public function edit($id)
    {
        $policy = Policies::with('subpolicies')->find($id);

        return Inertia::render('policies/edit', [
            'policy' => $policy,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'code' => 'required',
        ]);

        $policy = Policies::find($id);
        $policy->update($request->all());

        // Handle subpolicies if present
        if ($request->has('subpolicies')) {
            // Get IDs of existing subpolicies to determine which ones to delete
            $existingIds = $policy->subpolicies()->pluck('id')->toArray();
            $updatedIds = collect($request->subpolicies)->pluck('id')->filter()->toArray();

            // Delete subpolicies that are not in the updated list
            $toDelete = array_diff($existingIds, $updatedIds);
            Subpolices::whereIn('id', $toDelete)->delete();

            // Update or create subpolicies
            foreach ($request->subpolicies as $subpolicy) {
                if (!empty($subpolicy['id'])) {
                    // Update existing
                    Subpolices::where('id', $subpolicy['id'])->update([
                        'name' => $subpolicy['name'],
                    ]);
                } else {
                    // Create new
                    $policy->subpolicies()->create([
                        'name' => $subpolicy['name'],
                    ]);
                }
            }
        }

        return redirect()->route('policies.index');
    }

    public function destroy($id)
    {
        $policy = Policies::find($id);
        $policy->delete();

        return redirect()->route('policies.index');
    }
}
