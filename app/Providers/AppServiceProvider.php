<?php

namespace App\Providers;

use App\Services\PdfService;
use Illuminate\Support\ServiceProvider;
use Barryvdh\DomPDF\Facade\Pdf;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register PDF Service as a singleton
        $this->app->singleton('pdf.service', function ($app) {
            return new PdfService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
