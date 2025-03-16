import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from './ui/pagination';

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
}

export function Grid({ data, headers }: GridProps) {
    // Format date values if needed
    const formatCellData = (row: any, key: string) => {
        const value = row[key];

        return value;
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
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('policies.edit', row.id)}>Edit</Link>
                                        </Button>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <Pagination>
                <PaginationContent>
                    {data.current_page > 1 && (
                        <PaginationItem>
                            <PaginationPrevious href={`${data.path}?page=${data.current_page - 1}`} />
                        </PaginationItem>
                    )}

                    {Array.from({ length: data.last_page }, (_, i) => i + 1).map((page) => {
                        // Only show pages close to the current page
                        if (
                            page === 1 ||
                            page === data.last_page ||
                            (page >= data.current_page - 2 && page <= data.current_page + 2)
                        ) {
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href={`${data.path}?page=${page}`}
                                        isActive={page === data.current_page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        }

                        // Add ellipsis for gaps in page numbers
                        if (
                            (page === 2 && data.current_page > 4) ||
                            (page === data.last_page - 1 && data.current_page < data.last_page - 3)
                        ) {
                            return (
                                <PaginationItem key={`ellipsis-${page}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        return null;
                    }).filter(Boolean)}

                    {data.current_page < data.last_page && (
                        <PaginationItem>
                            <PaginationNext href={`${data.path}?page=${data.current_page + 1}`} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </>
    );
}
