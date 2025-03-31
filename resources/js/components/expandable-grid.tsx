import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from './ui/pagination';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, ChevronRight, Eye, PenIcon, Trash2Icon } from 'lucide-react';
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

interface Subpolicy {
    id: number;
    name: string;
    policy_id: number;
}

interface ExpandableGridProps {
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
    editRouteName?: string;
    viewRouteName?: string;
    childrenKey?: string; // Key that contains children records (default: 'subpolicies')
    childHeaders?: HeaderItem[]; // Headers for children rows
}

export function ExpandableGrid({
    data,
    headers,
    editRouteName,
    viewRouteName,
    childrenKey = 'subpolicies',
    childHeaders = [{ key: 'name', label: 'Name' }]
}: ExpandableGridProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleRow = (id: number) => {
        setExpandedRows(prevState =>
            prevState.includes(id)
                ? prevState.filter(rowId => rowId !== id)
                : [...prevState, id]
        );
    };

    const isRowExpanded = (id: number) => expandedRows.includes(id);

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

    // Determine the route names dynamically if not explicitly provided
    let routeEdit = editRouteName;
    let routeView = viewRouteName;

    if (typeof window !== 'undefined') {
        // Get the current URL path segments
        const pathSegments = window.location.pathname.split('/');
        // The first segment after the base URL is typically the resource name (e.g., 'policies')
        const resourceName = pathSegments.filter(segment => segment).shift();

        // Construct the route names if not provided
        if (resourceName) {
            if (!routeEdit) {
                routeEdit = `${resourceName}.edit`;
            }
            if (!routeView) {
                routeView = `${resourceName}.show`;
            }
        }
    }

    // Get the resource name for delete route
    const deleteRouteName = routeEdit?.replace('.edit', '.destroy');

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
                        <TableHead className="w-[50px]"></TableHead> {/* Column for expand/collapse icon */}
                        {headers.map((header) => (
                            <TableHead key={header.key}>{header.label}</TableHead>
                        ))}
                        <TableHead className='max-w-[150px]'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={headers.length + 2} className="text-center py-8">
                                No records found
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.data.flatMap((row, rowIndex) => {
                            const hasChildren = row[childrenKey] && row[childrenKey].length > 0;

                            // Main row
                            const mainRow = (
                                <TableRow key={`row-${row.id}`} className="border-b border-neutral-200">
                                    <TableCell>
                                        {hasChildren && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleRow(row.id)}
                                                className="p-1 h-6 w-6"
                                            >
                                                {isRowExpanded(row.id) ?
                                                    <ChevronDown className="h-4 w-4" /> :
                                                    <ChevronRight className="h-4 w-4" />}
                                            </Button>
                                        )}
                                    </TableCell>
                                    {headers.map((header) => (
                                        <TableCell key={`${rowIndex}-${header.key}`}>
                                            {formatCellData(row, header.key)}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {routeView && (
                                                <Button variant="outline" size="sm" asChild className="flex items-center">
                                                    <Link href={route(routeView, row.id)}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                </Button>
                                            )}
                                            {routeEdit && (
                                                <Button variant="outline" size="sm" asChild className="flex items-center">
                                                    <Link href={route(routeEdit, row.id)}>
                                                        <PenIcon className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                            )}
                                            {deleteRouteName && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(row.id)}
                                                    className="flex items-center"
                                                >
                                                    <Trash2Icon className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );

                            // Child rows (if expanded and has children)
                            const childRows = (isRowExpanded(row.id) && hasChildren)
                                ? row[childrenKey].map((child: any, childIndex: number) => (
                                    <TableRow
                                        key={`child-${row.id}-${child.id}`}
                                        className="bg-accent"
                                    >
                                        <TableCell>
                                            {/* Empty cell for spacing */}
                                        </TableCell>
                                        <TableCell colSpan={headers.length + 1}>
                                            <div className="pl-6 py-1 flex items-center">
                                                <div className="mr-2 h-0.5 w-3 bg-accent-foreground"></div>
                                                {childHeaders.map((header, i) => (
                                                    <div key={i} className="flex mr-4">
                                                        <span className="">{header.label}:</span>
                                                        <span>{formatCellData(child, header.key)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : [];

                            return [mainRow, ...childRows];
                        })
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
