<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingDetail extends Model
{
    protected $fillable = ['billing_id', 'policy_id', 'amount', 'type'];

    // Type constants
    const TYPE_DEBIT = 0;  // Cargo
    const TYPE_CREDIT = 1; // Abono
    const TYPE_INCOME = 2; // Ingreso
    const TYPE_EXPENSE = 3; // Egreso
    const TYPE_DAILY = 4;  // Diario

    public function billing(): BelongsTo
    {
        return $this->belongsTo(Billings::class, 'billing_id');
    }

    public function policy(): BelongsTo
    {
        return $this->belongsTo(Policies::class, 'policy_id');
    }

    public function getTypeTextAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_DEBIT => 'Cargo',
            self::TYPE_CREDIT => 'Abono',
            self::TYPE_INCOME => 'Ingreso',
            self::TYPE_EXPENSE => 'Egreso',
            self::TYPE_DAILY => 'Diario',
            default => 'Desconocido'
        };
    }
}
