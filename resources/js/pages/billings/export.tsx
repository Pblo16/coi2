import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billings',
        href: route('billings.index'),
    },
    {
        title: 'Export',
        href: route('billings.export.options'),
    },
];

export default function Export() {
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const exportAllPdf = () => {
        const url = route('billings.export.all.pdf') + `?start_date=${startDate}&end_date=${endDate}`;
        window.open(url, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Export Billings" />

            <CrudLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Export Billings" description="Export billing information to PDF" />

                    <div className="space-y-4">
                        <div className="border p-4 rounded-md">
                            <h2 className="text-lg font-medium mb-4">Export All Billings</h2>
                            <div className="grid gap-4 mb-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input 
                                        id="start_date"
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input 
                                        id="end_date"
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button onClick={exportAllPdf}>Export All Billings</Button>
                        </div>
                        
                        <div className="border p-4 rounded-md">
                            <h2 className="text-lg font-medium mb-4">Export Single Billing</h2>
                            <p className="mb-4">To export a single billing, navigate to the billing details page and use the export button there.</p>
                            <Button asChild variant="outline">
                                <Link href={route('billings.index')}>Go to Billings List</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CrudLayout>
        </AppLayout>
    );
}
