import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from "date-fns";
import { MapPin } from "lucide-react";

import AppLayout from '@/layouts/app-layout';
import CrudLayout from '@/layouts/app/app-crud';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

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

export default function View({ ruta }: { ruta: Ruta }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Rutas',
            href: route('rutas.index'),
        },
        {
            title: ruta.nombre || 'Detalles de Ruta',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ruta: ${ruta.nombre}`} />

            <CrudLayout>
                <div className="grid gap-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{ruta.nombre}</h1>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                asChild
                            >
                                <Link href={route('rutas.edit', ruta.id)}>Editar</Link>
                            </Button>
                            <Button 
                                variant="outline" 
                                asChild
                            >
                                <Link href={route('rutas.index')}>Volver</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información General</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-4">
                                    <div className="grid grid-cols-3">
                                        <dt className="font-medium text-neutral-500">Código:</dt>
                                        <dd className="col-span-2">{ruta.codigo}</dd>
                                    </div>
                                    
                                    <div className="grid grid-cols-3">
                                        <dt className="font-medium text-neutral-500">Fecha de inicio:</dt>
                                        <dd className="col-span-2">
                                            {ruta.fecha_inicio ? format(new Date(ruta.fecha_inicio), "PPP") : "No definida"}
                                        </dd>
                                    </div>
                                    
                                    <div className="grid grid-cols-3">
                                        <dt className="font-medium text-neutral-500">Fecha de fin:</dt>
                                        <dd className="col-span-2">
                                            {ruta.fecha_fin ? format(new Date(ruta.fecha_fin), "PPP") : "No definida"}
                                        </dd>
                                    </div>
                                    
                                    <div className="grid grid-cols-3">
                                        <dt className="font-medium text-neutral-500">Descripción:</dt>
                                        <dd className="col-span-2">{ruta.descripcion || "Sin descripción"}</dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Puntos de la Ruta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {ruta.detalles && ruta.detalles.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Punto</TableHead>
                                                <TableHead>Latitud</TableHead>
                                                <TableHead>Longitud</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ruta.detalles.map((punto, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{punto.order || index + 1}</TableCell>
                                                    <TableCell>{punto.latitude}</TableCell>
                                                    <TableCell>{punto.longitude}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="flex justify-center items-center p-6 text-neutral-500">
                                        <div className="text-center">
                                            <MapPin className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                            <p>No hay puntos definidos para esta ruta</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {ruta.detalles && ruta.detalles.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Visualización de la Ruta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border h-[400px] p-4 flex items-center justify-center bg-neutral-50">
                                    <p className="text-neutral-500">Aquí se puede integrar un mapa que muestre los puntos de la ruta</p>
                                    {/* 
                                    Aquí se podría integrar un componente de mapa (como Google Maps, Leaflet, etc.)
                                    que muestre los puntos de la ruta en un mapa real
                                    */}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </CrudLayout>
        </AppLayout>
    );
}
