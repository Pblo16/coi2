import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Table',
        href: 'index',
        icon: null,
    },
    {
        title: 'Create',
        href: 'create',
        icon: null,
    },
];

export default function CrudLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    // Extract the resource base path (e.g., /policies)
    // Get all path segments and find the resource name
    const pathSegments = currentPath.split('/').filter(segment => segment);
    // The first segment is typically the resource name
    const resourceName = pathSegments[0];
    // Create the proper base path
    const basePath = `/${resourceName}`;

    // Check which page we're on for highlighting the active link
    const lastSegment = pathSegments[pathSegments.length - 1];
    const currentPage = sidebarNavItems.some(item => item.href === lastSegment) ? lastSegment : 'index';

    return (
        <div className="px-4 py-6 h-full">

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12 h-full">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.href}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPage === item.href,
                                })}
                            >
                                <Link href={`${basePath}/${item.href}`} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex flex-1">
                    <section className=" flex flex-col flex-1">{children}</section>
                </div>
            </div>
        </div>
    );
}
