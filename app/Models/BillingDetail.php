<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'billing_id',
        'subpolicy_id', // Changed from policy_id to subpolicy_id
        'amount',
        'type'
    ];

    protected $appends = [
        'type_text'
    ];

    public function billing(): BelongsTo
    {
        return $this->belongsTo(Billings::class, 'billing_id');
    }

    public function subpolicy(): BelongsTo
    {
        return $this->belongsTo(Subpolices::class, 'subpolicy_id');
    }

    // Keep a policy accessor for compatibility
    public function policy(): BelongsTo
    {
        return $this->subpolicy();
    }

    public function getTypeTextAttribute(): string
    {
        $types = [
            0 => 'Cargo (Debit)',
            1 => 'Abono (Credit)'
        ];

        return $types[$this->type] ?? 'Unknown';
    }
}
