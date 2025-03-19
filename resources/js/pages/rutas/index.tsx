import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Grid } from '@/components/grid';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rutas',
        href: route('rutas.index'),
    },
];

interface RutasProps {
    rutas: any;
    headers: Array<{ key: string; label: string }>;
}

export default function Index({ rutas, headers }: RutasProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rutas" />

            <CrudLayout>
                <Grid data={rutas} headers={headers} />
            </CrudLayout>
        </AppLayout>
    );
}
