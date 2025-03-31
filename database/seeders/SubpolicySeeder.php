<?php

namespace Database\Seeders;

use App\Models\Policies;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Policy;
use Carbon\Carbon;

class SubpolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Get all policies to link subpolicies
        $policies = Policies::all()->keyBy('code');

        // Define subpolicies grouped by parent policy
        $subpolicies = [
            // EFECTIVO Y EQUIVALENTES
            1110000000 => [
                ['name' => 'CAJA GENERAL', 'policy_id' => null],
                ['name' => 'FONDO FIJO DE CAJA CHICA', 'policy_id' => null],
            ],
            // BANCOS
            1120000000 => [
                ['name' => 'BANCO DEL AHORRO NACIONAL', 'policy_id' => null],
                ['name' => 'BANCO DEL COMERCIO', 'policy_id' => null],
            ],
            // INVERSIONES EN VALORES
            1140000000 => [
                ['name' => 'INVERSIONES CUENTA #', 'policy_id' => null],
            ],
            // CLIENTES
            1150000000 => [
                ['name' => 'CONTADO', 'policy_id' => null],
                ['name' => 'CREDITO', 'policy_id' => null],
            ],
            // ALMACÉN
            1190000000 => [
                ['name' => 'ARTÍCULO A', 'policy_id' => null],
                ['name' => 'ARTÍCULO B', 'policy_id' => null],
                ['name' => 'ARTÍCULO C', 'policy_id' => null],
                ['name' => 'ARTÍCULO D', 'policy_id' => null],
                ['name' => 'ARTÍCULO E', 'policy_id' => null],
                ['name' => 'ARTÍCULO F', 'policy_id' => null],
            ],
            // PROVEEDORES
            2110000000 => [
                ['name' => 'COMERCIAL MABE', 'policy_id' => null],
                ['name' => 'CORPORACIÓN BRAMER', 'policy_id' => null],
                ['name' => 'CRISTALERÍA MÓNACO', 'policy_id' => null],
                ['name' => 'MIRANDA', 'policy_id' => null],
            ],
        ];

        // Prepare data for insertion by adding policy_id
        $data = [];
        foreach ($subpolicies as $policyCode => $subpolicyGroup) {
            if (isset($policies[$policyCode])) {
                $policyId = $policies[$policyCode]->id;
                foreach ($subpolicyGroup as $subpolicy) {
                    $subpolicy['policy_id'] = $policyId;
                    $subpolicy['created_at'] = $now;
                    $subpolicy['updated_at'] = $now;
                    $data[] = $subpolicy;
                }
            }
        }

        DB::table('subpolices')->insert($data);

        // Special case for nested subpolicy under CREDITO (1150-002-xxx)
        if (isset($policies[1150000000])) {
            $creditoSubpolicy = DB::table('subpolices')
                ->where('name', 'CREDITO')
                ->where('policy_id', $policies[1150000000]->id)
                ->first();

            if ($creditoSubpolicy) {
                $nestedSubpolicies = [
                    ['name' => 'SEPOMEX', 'policy_id' => $policies[1150000000]->id, 'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'TAKANA', 'policy_id' => $policies[1150000000]->id, 'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'MISTIC', 'policy_id' => $policies[1150000000]->id, 'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'LABSON', 'policy_id' => $policies[1150000000]->id, 'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'SIVA', 'policy_id' => $policies[1150000000]->id, 'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'ADVANCE', 'policy_id' => $policies[1150000000]->id, 'created_at' => $now, 'updated_at' => $now],
                ];

                DB::table('subpolices')->insert($nestedSubpolicies);
            }
        }
    }
}
