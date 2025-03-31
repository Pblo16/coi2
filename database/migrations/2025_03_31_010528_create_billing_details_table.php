<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('billing_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('billing_id')->constrained('billings')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->integer('type')->default(0)->comment('0: debit (cargo), 1: credit (abono), 2: income (ingreso), 3: expense (egreso), 4: daily (diario)');
            // Change from policy_id to subpolicy_id
            $table->foreignId('subpolicy_id')->constrained('subpolices')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billing_details');
    }
};
