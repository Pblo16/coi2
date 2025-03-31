import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, FileDown } from 'lucide-react';
import SearchableSubpolicySelect from '../billings/components/SearchableSubpolicySelect';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: route('reports.index'),
    },
    {
        title: 'Account Books',
        href: route('reports.account-books'),
    },
];

export default function AccountBooks({ policies, subpolicies }: { policies: any[], subpolicies: any[] }) {
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSubpolicyId, setSelectedSubpolicyId] = useState<string>("");

    const exportReport = () => {
        // Only export if a subpolicy is selected
        if (!selectedSubpolicyId) {
            alert('Please select a subpolicy to generate the report');
            return;
        }

        const url = route('reports.export.account-books') +
            `?start_date=${startDate}&end_date=${endDate}&subpolicy_id=${selectedSubpolicyId}`;
        window.open(url, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Books" />

            <CrudLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Account Books Report"
                        description="Generate detailed transaction history for specific accounts (Libro Mayor)"
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Report Parameters</CardTitle>
                            <CardDescription>
                                Select the subpolicy account and date range for your report
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subpolicy_id">Account (Subpolicy)</Label>
                                    <SearchableSubpolicySelect
                                        value={selectedSubpolicyId}
                                        onChange={setSelectedSubpolicyId}
                                        options={subpolicies}
                                        placeholder="Search for an account..."
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Start Date</Label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="start_date"
                                                type="date"
                                                className="pl-10"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">End Date</Label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="end_date"
                                                type="date"
                                                className="pl-10"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={exportReport}
                                disabled={!selectedSubpolicyId}
                            >
                                <FileDown className="mr-2 h-4 w-4" />
                                Generate Report
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </CrudLayout>
        </AppLayout>
    );
}
