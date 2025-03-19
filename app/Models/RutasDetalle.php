<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RutasDetalle extends Model
{
    //el detalle de las rutas va a tener latitud, longitud orden, id de ruta
    protected $fillable = [
        'latitude',
        'longitude',
        'order',
        'ruta_id',
    ];

    public function ruta()
    {
        return $this->belongsTo(Rutas::class, 'ruta_id');
    }
}
