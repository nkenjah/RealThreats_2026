import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { SessionLog, User } from '@/types';

interface Props {
    sessionLog: SessionLog & {
        user: User;
    };
}

export default function SessionLogsShow({ sessionLog }: Props) {
    return (
        <>
            <Head title="Session Log Details" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/session-logs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Session Log</h1>
                        <p className="text-sm text-muted-foreground">
                            {sessionLog.user?.name ?? 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Details</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">ID</dt>
                            <dd>{sessionLog.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">User</dt>
                            <dd>{sessionLog.user?.name ?? 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                IP Address
                            </dt>
                            <dd className="font-mono">
                                {sessionLog.ip_address}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                User Agent
                            </dt>
                            <dd className="max-w-[300px] truncate text-right">
                                {sessionLog.user_agent}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Login At</dt>
                            <dd>
                                {new Date(sessionLog.login_at).toLocaleString()}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Logout At</dt>
                            <dd>
                                {sessionLog.logout_at
                                    ? new Date(
                                          sessionLog.logout_at,
                                      ).toLocaleString()
                                    : 'Still active'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Duration (min)
                            </dt>
                            <dd>{sessionLog.duration_minutes ?? 'N/A'}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
}

SessionLogsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Session Logs', href: '/admin/session-logs' },
        { title: 'Session Log Details', href: '' },
    ],
};
