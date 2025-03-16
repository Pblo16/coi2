<?php

use App\Http\Controllers\PoliciesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::redirect('policies', 'policies/index');

    Route::get('policies/index', [PoliciesController::class, 'index'])->name('policies.index');
    Route::get('policies/create', [PoliciesController::class, 'create'])->name('policies.create');
    Route::get('policies/edit', [PoliciesController::class, 'edit'])->name('policies.edit');

    Route::patch('policies/edit', [PoliciesController::class, 'update'])->name('policies.update');
    Route::delete('policies/index', [PoliciesController::class, 'destroy'])->name('policies.destroy');
});
