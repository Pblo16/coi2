import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { format } from "date-fns";
import { CalendarIcon, PlusCircleIcon, TrashIcon } from "lucide-react";

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rutas',
        href: route('rutas.index'),
    },
    {
        title: 'Editar Ruta',
        href: '#',
    },
];

interface PuntoRuta {
    latitude: string;
    longitude: string;
    order?: number;
    id?: number;
}

interface Ruta {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    fecha_inicio: string;
    fecha_fin: string;
    detalles: PuntoRuta[];
}

interface RutaForm {
    nombre: string;
    codigo: string;
    descripcion: string;
    fecha_inicio: Date | string;
    fecha_fin: Date | string;
    puntos: PuntoRuta[];
    [key: string]: string | PuntoRuta[] | Date | undefined;
}

export default function Edit({ ruta }: { ruta: Ruta }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<RutaForm>({
        nombre: ruta.nombre || '',
        codigo: ruta.codigo || '',
        descripcion: ruta.descripcion || '',
        fecha_inicio: ruta.fecha_inicio ? new Date(ruta.fecha_inicio) : '',
        fecha_fin: ruta.fecha_fin ? new Date(ruta.fecha_fin) : '',
        puntos: ruta.detalles?.map(detalle => ({
            latitude: detalle.latitude,
            longitude: detalle.longitude,
        })) || [],
    });

    const [newPunto, setNewPunto] = useState<PuntoRuta>({
        latitude: '',
        longitude: '',
    });

    const addPunto = () => {
        if (newPunto.latitude && newPunto.longitude) {
            // Validate latitude between -90 and 90
            const lat = parseFloat(newPunto.latitude);
            // Validate longitude between -180 and 180
            const lng = parseFloat(newPunto.longitude);

            if (isNaN(lat) || lat < -90 || lat > 90) {
                alert('La latitud debe ser un número entre -90 y 90');
                return;
            }

            if (isNaN(lng) || lng < -180 || lng > 180) {
                alert('La longitud debe ser un número entre -180 y 180');
                return;
            }

            setData('puntos', [...data.puntos, { ...newPunto }]);
            setNewPunto({ latitude: '', longitude: '' });
        }
    };

    const removePunto = (index: number) => {
        const updatedPuntos = [...data.puntos];
        updatedPuntos.splice(index, 1);
        setData('puntos', updatedPuntos);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formattedData = {
            ...data,
            fecha_inicio: data.fecha_inicio instanceof Date
                ? format(data.fecha_inicio, 'yyyy-MM-dd')
                : data.fecha_inicio,
            fecha_fin: data.fecha_fin instanceof Date
                ? format(data.fecha_fin, 'yyyy-MM-dd')
                : data.fecha_fin,
        };

        patch(route('rutas.update', ruta.id), {
            preserveScroll: true,
            data: formattedData,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Ruta" />

            <CrudLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Información de la Ruta" description="Actualiza los detalles de la ruta" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                className="mt-1 block w-full"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                required
                                placeholder="Nombre de la ruta"
                            />
                            <InputError className="mt-2" message={errors.nombre} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="codigo">Código Único</Label>
                            <Input
                                id="codigo"
                                className="mt-1 block w-full "
                                value={data.codigo}
                                readOnly
                            />
                            <p className="text-xs text-neutral-500">El código es generado automáticamente</p>
                            <InputError className="mt-2" message={errors.codigo} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                className="mt-1 block w-full"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                placeholder="Descripción de la ruta"
                                rows={3}
                            />
                            <InputError className="mt-2" message={errors.descripcion} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="fecha_inicio"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !data.fecha_inicio && "text-muted-foreground"
                                            )}
                                        >
                                            {data.fecha_inicio ? (
                                                format(new Date(data.fecha_inicio), "PPP")
                                            ) : (
                                                <span>Seleccionar fecha de inicio</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={data.fecha_inicio ? new Date(data.fecha_inicio) : undefined}
                                            onSelect={(date) => setData('fecha_inicio', date || '')}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <InputError className="mt-2" message={errors.fecha_inicio} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="fecha_fin"
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !data.fecha_fin && "text-muted-foreground"
                                            )}
                                        >
                                            {data.fecha_fin ? (
                                                format(new Date(data.fecha_fin), "PPP")
                                            ) : (
                                                <span>Seleccionar fecha de fin</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="center">
                                        <Calendar
                                            mode="single"
                                            selected={data.fecha_fin ? new Date(data.fecha_fin) : undefined}
                                            onSelect={(date) => setData('fecha_fin', date || '')}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <InputError className="mt-2" message={errors.fecha_fin} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <HeadingSmall title="Puntos de la Ruta" description="Actualiza coordenadas de la ruta" />

                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="grid gap-2">
                                    <Label htmlFor="latitude">Latitud</Label>
                                    <Input
                                        id="latitude"
                                        value={newPunto.latitude}
                                        onChange={(e) => setNewPunto({ ...newPunto, latitude: e.target.value })}
                                        placeholder="Ej: 19.4326"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="longitude">Longitud</Label>
                                    <Input
                                        id="longitude"
                                        value={newPunto.longitude}
                                        onChange={(e) => setNewPunto({ ...newPunto, longitude: e.target.value })}
                                        placeholder="Ej: -99.1332"
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addPunto}
                                className="w-full"
                            >
                                <PlusCircleIcon className="h-4 w-4 mr-2" />
                                Agregar Punto
                            </Button>

                            {data.puntos.length > 0 && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Punto</TableHead>
                                            <TableHead>Latitud</TableHead>
                                            <TableHead>Longitud</TableHead>
                                            <TableHead className="w-[100px]">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.puntos.map((punto, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{punto.latitude}</TableCell>
                                                <TableCell>{punto.longitude}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removePunto(index)}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Actualizar Ruta</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Guardado</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </CrudLayout>
        </AppLayout>
    );
}
