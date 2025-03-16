import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import { Grid } from '@/components/grid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Policies',
        href: route('policies.index'),
    },
];

interface PoliciesProps {
    policies: any;
    headers: Array<{ key: string; label: string }>;
}

export default function Index({ policies, headers }: PoliciesProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Policies" />

            <CrudLayout>
                <Grid data={policies} headers={headers} />
            </CrudLayout>
        </AppLayout>
    );
}
