<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subpolices extends Model
{
    protected $fillable = ['name', 'policy_id'];

    public function policy(): BelongsTo
    {
        return $this->belongsTo(Policies::class, 'policy_id');
    }
}
