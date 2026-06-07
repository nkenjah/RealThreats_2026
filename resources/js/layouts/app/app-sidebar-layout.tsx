import { useState } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { CommandPalette } from '@/components/command-palette';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const [commandOpen, setCommandOpen] = useState(false);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader
                    breadcrumbs={breadcrumbs}
                    onCommandOpen={() => setCommandOpen(true)}
                />
                <main className="flex-1 p-6 md:p-8">{children}</main>
            </AppContent>
            <CommandPalette />
        </AppShell>
    );
}
