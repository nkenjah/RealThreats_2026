import { Breadcrumbs } from '@/components/breadcrumbs';
import { NotificationCenter } from '@/components/notification-center';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { CommandIcon } from 'lucide-react';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Button } from '@/components/ui/button';

export function AppSidebarHeader({
    breadcrumbs = [],
    onCommandOpen,
}: {
    breadcrumbs?: BreadcrumbItemType[];
    onCommandOpen?: () => void;
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCommandOpen}
                    aria-label="Command palette"
                    className="hidden sm:inline-flex"
                >
                    <CommandIcon className="size-5" />
                </Button>
                <NotificationCenter />
            </div>
        </header>
    );
}
