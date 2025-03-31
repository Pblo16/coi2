import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { ExpandableGrid } from '@/components/expandable-grid';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billings',
        href: route('billings.index'),
    },
];

interface BillingsProps {
    billings: any;
    headers: Array<{ key: string; label: string }>;
}

export default function Index({ billings, headers }: BillingsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billings" />

            <CrudLayout>
                <ExpandableGrid
                    data={billings}
                    headers={[
                        { key: 'details', label: 'Details' },
                        { key: 'account_type_text', label: 'Account Type' },
                    ]}
                    childrenKey="billingDetails"
                    childHeaders={[
                        { key: 'policy.name', label: 'Policy' },
                        { key: 'amount', label: 'Amount' },
                        { key: 'type_text', label: 'Type' }
                    ]}
                />
            </CrudLayout>
        </AppLayout>
    );
}
