import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import BillingDetailsGrid from './components/BillingDetailsGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BalanceSummary from './components/BalanceSummary';
import { BillingForm } from './types';
import { isBalanced } from './utils/calculations';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billings',
        href: route('billings.index'),
    },
    {
        title: 'Create Billing',
        href: '#',
    },
];

interface BillingDetail {
    id?: number;
    policy_id: number | string;
    amount: string | number;
    type: string | number;
    billing_id?: number;
}

// Account type options
const ACCOUNT_TYPES = [
    { value: 'ingreso', label: 'Ingreso' },
    { value: 'egreso', label: 'Egreso' },
    { value: 'diario', label: 'Diario' },
];

export default function Create({ policies }: { policies: any[] }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<BillingForm>({
        details: '',
        account_type: '',
        billingDetails: [],
    });

    const [balanceError, setBalanceError] = useState<string | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Check if billing details are balanced before submitting
        if (!isBalanced(data.billingDetails)) {
            setBalanceError('No se puede guardar: La cuenta no está balanceada. Los cargos deben ser iguales a los abonos.');
            return;
        }

        setBalanceError(null);
        post(route('billings.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Billing" />

            <CrudLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Billing information" description="Enter billing details" />

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
                                onChange={(billingDetails) => {
                                    setData('billingDetails', billingDetails);
                                    setBalanceError(null); // Clear error when user makes changes
                                }}
                                policies={policies}
                            />

                            {data.billingDetails.length > 0 && (
                                <div className="mt-4">
                                    <BalanceSummary billingDetails={data.billingDetails} />
                                </div>
                            )}

                            {balanceError && (
                                <div className="mt-2 text-sm text-red-600">
                                    {balanceError}
                                </div>
                            )}
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
