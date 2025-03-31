<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Billings extends Model
{
    protected $fillable = ['details', 'account_type'];

    // Account type constants
    const TYPE_INCOME = 'ingreso';
    const TYPE_EXPENSE = 'egreso';
    const TYPE_DAILY = 'diario';

    public function billingDetails(): HasMany
    {
        return $this->hasMany(BillingDetail::class, 'billing_id');
    }

    public function getAccountTypeTextAttribute(): string
    {
        return match ($this->account_type) {
            self::TYPE_INCOME => 'Ingreso',
            self::TYPE_EXPENSE => 'Egreso',
            self::TYPE_DAILY => 'Diario',
            default => $this->account_type
        };
    }
}
