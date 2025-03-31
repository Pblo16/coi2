import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import SubpoliciesGrid from './components/SubpoliciesGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cuentas',
        href: route('policies.index'),
    },
    {
        title: 'Crear Cuenta',
        href: '#',
    },
];

interface Subpolicy {
    id?: number;
    name: string;
    policy_id?: number;
}

interface PolicyForm {
    name: string;
    code: string;
    subpolicies: Subpolicy[];
    [key: string]: string | Subpolicy[];
}

export default function Create() {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<PolicyForm>({
        name: '',
        code: '',
        subpolicies: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('policies.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Cuenta" />

            <CrudLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Cuenta informacion" description="detalle de la cuenta" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Cuenta name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>

                            <Input
                                id="code"
                                className="mt-1 block w-full"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                                placeholder="Cuenta code"
                                type='number'
                            />

                            <InputError className="mt-2" message={errors.code} />
                        </div>

                        <div className="border-t pt-6">
                            <SubpoliciesGrid
                                subpolicies={data.subpolicies}
                                onChange={(subpolicies) => setData('subpolicies', subpolicies)}
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
