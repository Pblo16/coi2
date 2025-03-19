<?php

use App\Http\Controllers\RutasController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::redirect('rutas', 'rutas/index');

    Route::get('rutas/index', [RutasController::class, 'index'])->name('rutas.index');
    Route::get('rutas/create', [RutasController::class, 'create'])->name('rutas.create');
    Route::post('rutas/create', [RutasController::class, 'store'])->name('rutas.store');

    // Update edit route to include ID parameter
    Route::get('rutas/edit/{id}', [RutasController::class, 'edit'])->name('rutas.edit');
    Route::patch('rutas/edit/{id}', [RutasController::class, 'update'])->name('rutas.update');

    Route::delete('rutas/{id}', [RutasController::class, 'destroy'])->name('rutas.destroy');
});
