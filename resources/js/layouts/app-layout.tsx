import { AiAssistant } from '@/components/ai-assistant';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import RiskWarningToast from '@/components/shared/RiskWarningToast';
import { FlashMessageHandler } from '@/components/flash-message-handler';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <RiskWarningToast />
            <FlashMessageHandler />
            {children}
            <Toaster richColors closeButton />
            <AiAssistant />
        </AppLayoutTemplate>
    );
}
