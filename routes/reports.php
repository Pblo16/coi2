<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReportsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('reports')->group(function () {
        // Main reports index
        Route::get('/index', [ReportsController::class, 'index'])->name('reports.index');

        // General Ledger (Balanza General)
        Route::get('/general-ledger', [ReportsController::class, 'generalLedger'])->name('reports.general-ledger');
        Route::get('/export/general-ledger', [ReportsController::class, 'exportGeneralLedger'])->name('reports.export.general-ledger');

        // Account Books (Libro Mayor)
        Route::get('/account-books', [ReportsController::class, 'accountBooks'])->name('reports.account-books');
        Route::get('/export/account-books', [ReportsController::class, 'exportAccountBooks'])->name('reports.export.account-books');
    });
});
