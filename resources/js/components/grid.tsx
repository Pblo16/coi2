import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from './ui/pagination';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface HeaderItem {
    key: string;
    label: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLinks[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface GridProps {
    data: {
        data: any[];
        current_page?: number;
        from?: number;
        last_page?: number;
        links?: PaginationLinks[];
        path?: string;
        per_page?: number;
        to?: number;
        total?: number;

    };
    headers: HeaderItem[];
    editRouteName?: string; // Optional: can be provided explicitly if needed
}

export function Grid({ data, headers, editRouteName }: GridProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Format date values if needed
    const formatCellData = (row: any, key: string) => {
        const value = row[key];

        return value;
    };

    // Extract pagination values with defaults
    const currentPage = data.current_page ?? 1;
    const lastPage = data.last_page ?? 1;
    const path = data.path ?? '';
    const hasPagination = data.last_page !== undefined && data.last_page > 1;

    // Determine the edit route name dynamically if not explicitly provided
    let routeName = editRouteName;
    if (!routeName && typeof window !== 'undefined') {
        // Get the current URL path segments
        const pathSegments = window.location.pathname.split('/');
        // The first segment after the base URL is typically the resource name (e.g., 'policies')
        const resourceName = pathSegments.filter(segment => segment).shift();
        // Construct the route name (e.g., 'policies.edit')
        if (resourceName) {
            routeName = `${resourceName}.edit`;
        }
    }

    // Get the resource name for delete route
    const deleteRouteName = routeName?.replace('.edit', '.destroy');

    const handleDelete = () => {
        if (deleteId !== null) {
            router.delete(route(deleteRouteName!, deleteId), {
                preserveScroll: true,
            });
            setDialogOpen(false);
        }
    };

    const openDeleteDialog = (id: number) => {
        setDeleteId(id);
        setDialogOpen(true);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header) => (
                            <TableHead key={header.key}>{header.label}</TableHead>
                        ))}
                        <TableHead className='max-w-[100px]'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={headers.length + 1} className="text-center py-8">
                                No records found
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {headers.map((header) => (
                                    <TableCell key={`${rowIndex}-${header.key}`}>
                                        {formatCellData(row, header.key)}
                                    </TableCell>
                                ))}
                                <TableCell className='max-w-[100px]'>
                                    <div className="flex gap-2">
                                        {routeName && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route(routeName, row.id)}>
                                                    Edit
                                                </Link>
                                            </Button>
                                        )}
                                        {deleteRouteName && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => openDeleteDialog(row.id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Delete confirmation dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
                    <DialogDescription>
                        Once deleted, all of its resources and data will be permanently removed.
                        This action cannot be undone.
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {hasPagination && (
                <Pagination>
                    <PaginationContent>
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious href={`${path}?page=${currentPage - 1}`} />
                            </PaginationItem>
                        )}

                        {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => {
                            // Only show pages close to the current page
                            if (
                                page === 1 ||
                                page === lastPage ||
                                (page >= currentPage - 2 && page <= currentPage + 2)
                            ) {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href={`${path}?page=${page}`}
                                            isActive={page === currentPage}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }

                            // Add ellipsis for gaps in page numbers
                            if (
                                (page === 2 && currentPage > 4) ||
                                (page === lastPage - 1 && currentPage < lastPage - 3)
                            ) {
                                return (
                                    <PaginationItem key={`ellipsis-${page}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            return null;
                        }).filter(Boolean)}

                        {currentPage < lastPage && (
                            <PaginationItem>
                                <PaginationNext href={`${path}?page=${currentPage + 1}`} />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
}
