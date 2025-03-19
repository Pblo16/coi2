<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rutas extends Model
{
    //Las rutas van a tener, nombre, codigo, descripcion, fecha de inicio y fecha de fin
    protected $fillable = [
        'nombre',
        'codigo',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
    ];

    public function detalles()
    {
        return $this->hasMany(RutasDetalle::class, 'ruta_id');
    }
}
