import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, FileDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: route('reports.index'),
    },
    {
        title: 'General Ledger',
        href: route('reports.general-ledger'),
    },
];

export default function GeneralLedger({ policies }: { policies: any[] }) {
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedPolicyId, setSelectedPolicyId] = useState<string>("all");

    const exportReport = () => {
        const url = route('reports.export.general-ledger') +
            `?start_date=${startDate}&end_date=${endDate}&policy_id=${selectedPolicyId}`;
        window.open(url, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="General Ledger" />

            <CrudLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="General Ledger Report"
                        description="Generate a report of account balances (Balanza General)"
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Report Parameters</CardTitle>
                            <CardDescription>
                                Select the date range and optional policy filter for your report
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
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

                                <div className="space-y-2">
                                    <Label htmlFor="policy_id">Policy (Optional)</Label>
                                    <Select
                                        value={selectedPolicyId}
                                        onValueChange={setSelectedPolicyId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Policy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Policies</SelectItem>
                                            {policies?.map(policy => (
                                                <SelectItem key={policy.id} value={policy.id.toString()}>
                                                    {policy.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={exportReport}>
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
