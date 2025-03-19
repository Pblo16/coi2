<?php

namespace App\Http\Controllers;

use App\Models\Rutas;
use App\Models\RutasDetalle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class RutasController extends Controller
{
    public function index()
    {
        $headers = [
            ['key' => 'nombre', "label" => "Nombre"],
            ['key' => 'codigo', "label" => "Código"],
            ['key' => 'descripcion', "label" => "Descripción"],
            ['key' => 'fecha_inicio', "label" => "Fecha Inicio"],
            ['key' => 'fecha_fin', "label" => "Fecha Fin"],
        ];

        $rutas = Rutas::paginate(10);

        return Inertia::render('rutas/index', [
            'rutas' => $rutas,
            'headers' => $headers,
        ]);
    }

    public function create()
    {
        // Generate a new route code with format RT-XXX
        $latestRoute = Rutas::orderBy('id', 'desc')->first();
        $nextNumber = $latestRoute ? (int)substr($latestRoute->codigo, 3) + 1 : 1;
        $newCode = 'RT-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return Inertia::render('rutas/create', [
            'generatedCode' => $newCode,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'codigo' => 'required|unique:rutas,codigo',
            'descripcion' => 'nullable',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'puntos' => 'nullable|array',
            'puntos.*.latitude' => 'required|numeric|between:-90,90',
            'puntos.*.longitude' => 'required|numeric|between:-180,180',
        ]);

        // Format dates properly for MySQL
        $fechaInicio = $request->fecha_inicio ? Carbon::parse($request->fecha_inicio)->format('Y-m-d') : null;
        $fechaFin = $request->fecha_fin ? Carbon::parse($request->fecha_fin)->format('Y-m-d') : null;

        $ruta = Rutas::create([
            'nombre' => $request->nombre,
            'codigo' => $request->codigo,
            'descripcion' => $request->descripcion,
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
        ]);

        if ($request->has('puntos') && !empty($request->puntos)) {
            foreach ($request->puntos as $index => $punto) {
                RutasDetalle::create([
                    'ruta_id' => $ruta->id,
                    'latitude' => $punto['latitude'],
                    'longitude' => $punto['longitude'],
                    'order' => $index + 1,
                ]);
            }
        }

        return redirect()->route('rutas.index');
    }

    public function edit($id)
    {
        $ruta = Rutas::with('detalles')->find($id);

        return Inertia::render('rutas/edit', [
            'ruta' => $ruta,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required',
            'codigo' => 'required|unique:rutas,codigo,' . $id,
            'descripcion' => 'nullable',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'puntos' => 'nullable|array',
            'puntos.*.latitude' => 'required|numeric|between:-90,90',
            'puntos.*.longitude' => 'required|numeric|between:-180,180',
        ]);

        // Format dates properly for MySQL
        $fechaInicio = $request->fecha_inicio ? Carbon::parse($request->fecha_inicio)->format('Y-m-d') : null;
        $fechaFin = $request->fecha_fin ? Carbon::parse($request->fecha_fin)->format('Y-m-d') : null;

        $ruta = Rutas::find($id);
        $ruta->update([
            'nombre' => $request->nombre,
            'codigo' => $request->codigo,
            'descripcion' => $request->descripcion,
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
        ]);

        // Delete existing points
        RutasDetalle::where('ruta_id', $id)->delete();

        // Add new points
        if ($request->has('puntos') && !empty($request->puntos)) {
            foreach ($request->puntos as $index => $punto) {
                RutasDetalle::create([
                    'ruta_id' => $ruta->id,
                    'latitude' => $punto['latitude'],
                    'longitude' => $punto['longitude'],
                    'order' => $index + 1,
                ]);
            }
        }

        return redirect()->route('rutas.index');
    }

    public function destroy($id)
    {
        $ruta = Rutas::find($id);
        $ruta->delete();

        return redirect()->route('rutas.index');
    }
}
