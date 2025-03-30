<?php

namespace App\Http\Controllers;

use App\Models\Subpolices;
use App\Models\Policies;
use Illuminate\Http\Request;

class SubpolicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'policy_id' => 'required|exists:policies,id'
        ]);

        $subpolicy = Subpolices::create($request->all());

        return response()->json($subpolicy);
    }

    /**
     * Display the specified resource.
     */
    public function show(Subpolices $subpolices)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subpolices $subpolices)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $subpolicy = Subpolices::find($id);
        $subpolicy->update($request->all());

        return response()->json($subpolicy);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $subpolicy = Subpolices::find($id);
        $subpolicy->delete();

        return response()->json(['success' => true]);
    }
}
