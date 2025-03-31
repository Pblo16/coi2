import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { FileTextIcon, FileSpreadsheetIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: route('reports.index'),
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />


            <div className="space-y-6 px-4">
                <HeadingSmall title="Financial Reports" description="Generate and export financial reports" />

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Ledger</CardTitle>
                            <CardDescription>
                                View and export general ledger reports (Balanza General)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Generate a report showing account balances across all policies for a specified period.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild>
                                <Link href={route('reports.general-ledger')}>
                                    <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
                                    View Report
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Books</CardTitle>
                            <CardDescription>
                                View and export account book reports (Libro Mayor)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Generate detailed transaction history for specific accounts over a selected time period.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild>
                                <Link href={route('reports.account-books')}>
                                    <FileTextIcon className="mr-2 h-4 w-4" />
                                    View Report
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
