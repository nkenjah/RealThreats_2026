import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { AppNotification } from '@/types';

interface Props {
    notifications: {
        data: AppNotification[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
}

function notificationIcon(type: string): string {
    switch (type) {
        case 'grade_submitted':
            return '📝';
        case 'grade_approved':
            return '✅';
        case 'grade_rejected':
            return '❌';
        case 'threat_alert':
            return '🔴';
        case 'account_locked':
            return '🔒';
        case 'unlock_request':
            return '🔓';
        default:
            return '🔔';
    }
}

export default function NotificationsIndex({ notifications }: Props) {
    return (
        <>
            <Head title="Notifications" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        <p className="text-sm text-muted-foreground">
                            {notifications.total} total notifications
                        </p>
                    </div>
                    {notifications.total > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.post(
                                    '/notifications/mark-all-as-read',
                                    {},
                                )
                            }
                        >
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="space-y-2">
                    {notifications.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-20 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">
                                No notifications yet.
                            </p>
                        </div>
                    ) : (
                        notifications.data.map((notif) => (
                            <div
                                key={notif.id}
                                className={cn(
                                    'flex items-start gap-4 rounded-lg border p-4 transition-colors',
                                    !notif.read_at && 'bg-muted/30',
                                )}
                            >
                                <span className="mt-0.5 text-lg">
                                    {notificationIcon(notif.data?.type ?? '')}
                                </span>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm">
                                        {notif.data?.message ?? ''}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {notif.created_at}
                                    </p>
                                </div>
                                {!notif.read_at && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.post(
                                                `/notifications/${notif.id}/mark-as-read`,
                                                {},
                                            )
                                        }
                                    >
                                        <CheckCheck className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {notifications.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {Array.from(
                            { length: notifications.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <Link
                                key={page}
                                href={`/notifications?page=${page}`}
                                className={cn(
                                    'inline-flex h-8 w-8 items-center justify-center rounded text-sm',
                                    page === notifications.current_page
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted',
                                )}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Notifications', href: '/notifications' },
    ],
};
