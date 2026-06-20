import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { PageProps, AppNotification } from '@/types';

export function NotificationCenter() {
    const { notifications, unread_count } = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);

    const handleMarkRead = (id: string) => {
        router.post(
            `/notifications/${id}/mark-as-read`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setOpen(false),
            },
        );
    };

    const handleMarkAllRead = () => {
        router.post(
            '/notifications/mark-all-as-read',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setOpen(false),
            },
        );
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-5" />
                    {unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                            {unread_count > 9 ? '9+' : unread_count}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unread_count > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <CheckCheck className="size-3" />
                            Mark all read
                        </button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="px-2 py-8 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notif: AppNotification) => (
                        <DropdownMenuItem
                            key={notif.id}
                            className={cn(
                                'flex items-start gap-3 py-3',
                                !notif.read_at && 'bg-muted/40',
                            )}
                            onSelect={(e) => e.preventDefault()}
                        >
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                        {notif.data?.title ??
                                            notif.data?.type?.replace(
                                                /_/g,
                                                ' ',
                                            ) ??
                                            'Notification'}
                                    </p>
                                    {!notif.read_at && (
                                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                                    )}
                                </div>
                                <p className="line-clamp-2 text-xs text-muted-foreground">
                                    {notif.data?.message ?? ''}
                                </p>
                                <p className="text-[10px] text-muted-foreground/60">
                                    {notif.created_at}
                                </p>
                            </div>
                            {!notif.read_at && (
                                <button
                                    onClick={() => handleMarkRead(notif.id)}
                                    className="mt-0.5 shrink-0 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                                >
                                    <CheckCheck className="size-3.5" />
                                </button>
                            )}
                        </DropdownMenuItem>
                    ))
                )}
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="justify-center text-sm text-muted-foreground"
                            onSelect={() => router.visit('/notifications')}
                        >
                            <ChevronRight className="size-3.5" />
                            View all notifications
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
