<?php

namespace App\Http\Controllers;

use App\Models\Policies;
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

        Policies::create($request->all());

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
        $policy = Policies::find($id);

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

        return redirect()->route('policies.index');
    }

    public function destroy($id)
    {
        $policy = Policies::find($id);
        $policy->delete();

        return redirect()->route('policies.index');
    }
}
