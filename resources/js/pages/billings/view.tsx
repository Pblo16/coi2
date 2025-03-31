import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface BillingDetail {
    id: number;
    policy: {
        id: number;
        name: string;
    };
    amount: number;
    type: number;
    type_text: string;
}

interface Billing {
    id: number;
    details: string;
    account_type: string;
    account_type_text: string;
    billingDetails: BillingDetail[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billings',
        href: route('billings.index'),
    },
    {
        title: 'View Billing',
        href: '#',
    },
];

export default function View({ billing }: { billing: Billing }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Billing" />

            <CrudLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Billing Information" description="View billing details" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium">Details</h3>
                            <p>{billing.details}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Account Type</h3>
                            <p>{billing.account_type_text}</p>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Billing Details</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Policy</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {billing.billingDetails.map((detail) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>{detail.policy.name}</TableCell>
                                        <TableCell>{detail.amount}</TableCell>
                                        <TableCell>{detail.type_text}</TableCell>
                                    </TableRow>
                                ))}
                                {billing.billingDetails.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No billing details found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={route('billings.edit', billing.id)}>Edit</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={route('billings.index')}>Back to List</Link>
                        </Button>
                    </div>
                </div>
            </CrudLayout>
        </AppLayout>
    );
}
