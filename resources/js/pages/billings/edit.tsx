import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import BillingDetailsGrid from './components/BillingDetailsGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billings',
        href: route('billings.index'),
    },
    {
        title: 'Edit Billing',
        href: '#',
    },
];

interface BillingDetail {
    id?: number;
    policy_id: number | string;
    amount: string | number;
    type: string | number;
    billing_id?: number;
    policy?: any;
}

interface Billing {
    id: number;
    details: string;
    account_type: string;
    billingDetails: BillingDetail[];
}

interface BillingForm {
    details: string;
    account_type: string;
    billingDetails: BillingDetail[];
}

// Account type options
const ACCOUNT_TYPES = [
    { value: 'ingreso', label: 'Ingreso' },
    { value: 'egreso', label: 'Egreso' },
    { value: 'diario', label: 'Diario' },
];

export default function Edit({ billing, policies }: { billing: Billing, policies: any[] }) {
    // Initialize form with billing data, ensuring billing details are properly formatted
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<BillingForm>({
        details: billing.details || '',
        account_type: billing.account_type || '',
        billingDetails: Array.isArray(billing.billingDetails) ? billing.billingDetails.map(detail => ({
            id: detail.id,
            policy_id: detail.policy_id,
            amount: detail.amount,
            type: detail.type.toString(),
        })) : [],
    });

    useEffect(() => {
        // Debug the loading of billing details
        console.log('Loaded billing:', billing);
        console.log('Initial form data:', data);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Debug submission data
        console.log('Submitting form data:', data);

        patch(route('billings.update', billing.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Billing" />

            <CrudLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Billing information" description="Update billing details" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="details">Details</Label>

                            <Input
                                id="details"
                                className="mt-1 block w-full"
                                value={data.details}
                                onChange={(e) => setData('details', e.target.value)}
                                required
                                placeholder="Billing details"
                            />

                            <InputError className="mt-2" message={errors.details} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="account_type">Account Type</Label>

                            <Select
                                value={data.account_type}
                                onValueChange={(value) => setData('account_type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Account Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ACCOUNT_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <InputError className="mt-2" message={errors.account_type} />
                        </div>

                        <div className="border-t pt-6">
                            <BillingDetailsGrid
                                billingDetails={data.billingDetails}
                                onChange={(billingDetails) => setData('billingDetails', billingDetails)}
                                policies={policies}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </CrudLayout>
        </AppLayout>
    );
}
