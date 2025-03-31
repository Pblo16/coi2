<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PoliciesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $policies = [
            ['name' => 'EFECTIVO Y EQUIVALENTES', 'code' => 1110000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'BANCOS', 'code' => 1120000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'INVERSIONES EN VALORES', 'code' => 1140000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'CLIENTES', 'code' => 1150000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ESTIMACION DE CUENTAS INCOBRABLES', 'code' => 1155000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'DOCUMENTOS POR COBRAR', 'code' => 1160000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'DEUDORES DIVERSOS', 'code' => 1170000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'IMPUESTOS A FAVOR', 'code' => 1180000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ALMACÉN', 'code' => 1190000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'IMPUESTOS ACREDITABLES', 'code' => 1200000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'IMPUESTOS POR ACREDITAR', 'code' => 1201000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'PAGOS ANTICIPADOS', 'code' => 1210000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ANTICIPOS A PROVEEDORES', 'code' => 1215000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ANTICIPOS DE IMPUESTOS', 'code' => 1220000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'PROPIEDADES PLANTA Y EQUIPO', 'code' => 1310000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'DEPRECIACION', 'code' => 1360000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'PATENTES Y MARCAS', 'code' => 1410000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'GASTOS DE INSTALACION', 'code' => 1420000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'AMORTIZACION DE GASTOS DIFERIDOS', 'code' => 1460000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'DEPOSITOS EN GARANTIA', 'code' => 1470000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'PROVEEDORES', 'code' => 2110000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ACREEDORES DIVERSOS', 'code' => 2120000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'DOCUMENTOS POR PAGAR', 'code' => 2130000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'IMPUESTOS Y DERECHOS POR PAGAR', 'code' => 2140000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'IMPUESTOS Y CONTRIBUCIONES RETENIDOS', 'code' => 2150000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'CAPITAL SOCIAL', 'code' => 3100000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'VENTAS', 'code' => 4100000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'COSTO DE VENTAS', 'code' => 5000000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'GASTOS DE VENTA', 'code' => 6100000000, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'GASTOS DE ADMINISTRACIÓN', 'code' => 6200000000, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('policies')->insert($policies);
    }
}
