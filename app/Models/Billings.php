<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Billings extends Model
{
    use HasFactory;

    protected $fillable = [
        'details',
        'account_type',
    ];

    protected $appends = [
        'account_type_text'
    ];

    public function billingDetails(): HasMany
    {
        return $this->hasMany(BillingDetail::class, 'billing_id');
    }

    public function getAccountTypeTextAttribute(): string
    {
        $types = [
            'ingreso' => 'Ingreso',
            'egreso' => 'Egreso',
            'diario' => 'Diario',
        ];

        return $types[$this->account_type] ?? 'Unknown';
    }
}
