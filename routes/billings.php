<?php

use App\Http\Controllers\BillingsController;
use App\Http\Controllers\SubpolicesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::redirect('billings', 'billings/index');

    Route::get('billings/index', [BillingsController::class, 'index'])->name('billings.index');
    Route::get('billings/create', [BillingsController::class, 'create'])->name('billings.create');
    Route::post('billings/create', [BillingsController::class, 'store'])->name('billings.store');

    // Add view route
    Route::get('billings/{id}', [BillingsController::class, 'show'])->name('billings.show');

    // Update edit route to include ID parameter
    Route::get('billings/edit/{id}', [BillingsController::class, 'edit'])->name('billings.edit');
    Route::patch('billings/edit/{id}', [BillingsController::class, 'update'])->name('billings.update');

    Route::delete('billings/{id}', [BillingsController::class, 'destroy'])->name('billings.destroy');

    // Subbillings routes
    Route::post('subbillings', [SubpolicesController::class, 'store'])->name('subbillings.store');
    Route::put('subbillings/{id}', [SubpolicesController::class, 'update'])->name('subbillings.update');
    Route::delete('subbillings/{id}', [SubpolicesController::class, 'destroy'])->name('subbillings.destroy');
});
