import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import type { PageProps, AppNotification } from '@/types';

export default function NotificationDropdown() {
    const { notifications, unread_count } = usePage<PageProps>().props;

    const getIcon = (type: string) => {
        switch (type) {
            case 'threat_alert':
                return '🔴';
            case 'account_locked':
                return '🔒';
            case 'unlock_request':
                return '🔓';
            default:
                return '🔔';
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                            {unread_count > 9 ? '9+' : unread_count}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notif: AppNotification) => (
                        <DropdownMenuItem
                            key={notif.id}
                            className="flex items-start gap-3 py-3"
                        >
                            <span className="mt-0.5 text-base">
                                {getIcon(notif.type)}
                            </span>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">
                                    {notif.data?.user_name ?? 'System'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {notif.data?.reason ??
                                        notif.data?.alert_type ??
                                        ''}
                                </p>
                                <p className="text-[10px] text-muted-foreground/60">
                                    {notif.created_at}
                                </p>
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href="/admin/activity-logs"
                                className="w-full text-center text-sm"
                            >
                                View all
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
