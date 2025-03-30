<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Policies extends Model
{
    protected $fillable = ['name', 'code'];

    public function subpolicies(): HasMany
    {
        return $this->hasMany(Subpolices::class, 'policy_id');
    }
}
