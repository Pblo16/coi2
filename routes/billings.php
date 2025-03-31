<?php

use App\Http\Controllers\BillingsController;
use App\Http\Controllers\SubpolicesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('billings')->group(function () {
        // Export routes - These need to go first to avoid conflicts with {id} parameter routes
        Route::get('/export/options', [BillingsController::class, 'showExportOptions'])->name('billings.export.options');
        Route::get('/export-all-pdf', [BillingsController::class, 'exportAllPdf'])->name('billings.export.all.pdf');
        Route::get('/{id}/export-pdf', [BillingsController::class, 'exportPdf'])->name('billings.export.pdf');

        // Regular CRUD routes
        Route::get('/index', [BillingsController::class, 'index'])->name('billings.index');
        Route::get('/create', [BillingsController::class, 'create'])->name('billings.create');
        Route::post('/', [BillingsController::class, 'store'])->name('billings.store');
        Route::get('/{id}', [BillingsController::class, 'show'])->name('billings.show');
        Route::get('/{id}/edit', [BillingsController::class, 'edit'])->name('billings.edit');
        Route::patch('/{id}', [BillingsController::class, 'update'])->name('billings.update');
        Route::delete('/{id}', [BillingsController::class, 'destroy'])->name('billings.destroy');
    });

    // Subbillings routes
    Route::post('subbillings', [SubpolicesController::class, 'store'])->name('subbillings.store');
    Route::put('subbillings/{id}', [SubpolicesController::class, 'update'])->name('subbillings.update');
    Route::delete('subbillings/{id}', [SubpolicesController::class, 'destroy'])->name('subbillings.destroy');
});
