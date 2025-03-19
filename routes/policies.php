<?php

use App\Http\Controllers\PoliciesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::redirect('policies', 'policies/index');

    Route::get('policies/index', [PoliciesController::class, 'index'])->name('policies.index');
    Route::get('policies/create', [PoliciesController::class, 'create'])->name('policies.create');
    Route::post('policies/create', [PoliciesController::class, 'store'])->name('policies.store');

    // Add view route
    Route::get('policies/{id}', [PoliciesController::class, 'show'])->name('policies.show');

    // Update edit route to include ID parameter
    Route::get('policies/edit/{id}', [PoliciesController::class, 'edit'])->name('policies.edit');
    Route::patch('policies/edit/{id}', [PoliciesController::class, 'update'])->name('policies.update');

    Route::delete('policies/{id}', [PoliciesController::class, 'destroy'])->name('policies.destroy');
});
