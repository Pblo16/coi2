import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { ExpandableGrid } from '@/components/expandable-grid';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';

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
                <ExpandableGrid
                    data={policies}
                    headers={headers}
                    childrenKey="subpolicies"
                    childHeaders={[{ key: 'name', label: 'Name' }]}
                />
            </CrudLayout>
        </AppLayout>
    );
}
