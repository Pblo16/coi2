import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { ExpandableGrid } from '@/components/expandable-grid';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

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
                <div className="flex justify-between mb-4">
                    <h1 className="text-xl font-medium">Billings</h1>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('billings.export.options')}>Export</Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('billings.create')}>Create</Link>
                        </Button>
                    </div>
                </div>

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
