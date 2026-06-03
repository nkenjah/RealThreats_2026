import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Unlock, LogOut, Shield } from 'lucide-react';
import UserRiskBadge from '@/components/users/UserRiskBadge';
import RiskScoreGauge from '@/components/users/RiskScoreGauge';
import UserActivityTimeline from '@/components/users/UserActivityTimeline';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { useState } from 'react';
import type { User, ActivityLog, UserSessionsTracker } from '@/types';

interface Props {
    user: User & { sessionTracker: UserSessionsTracker[] };
    activity: ActivityLog[];
}

export default function UsersShow({ user, activity }: Props) {
    const [showLock, setShowLock] = useState(false);
    const [showUnlock, setShowUnlock] = useState(false);
    const [showForceLogout, setShowForceLogout] = useState(false);

    return (
        <>
            <Head title={`User: ${user.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!user.is_locked ? (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowLock(true)}
                            >
                                <Lock className="mr-2 h-4 w-4" /> Lock Account
                            </Button>
                        ) : (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => setShowUnlock(true)}
                            >
                                <Unlock className="mr-2 h-4 w-4" /> Unlock
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowForceLogout(true)}
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Force Logout
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6">
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-4 text-sm font-medium">
                                Risk Score
                            </h2>
                            <RiskScoreGauge
                                score={user.risk_score?.current_score ?? 0}
                            />
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-4 text-sm font-medium">
                                User Details
                            </h2>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Department
                                    </dt>
                                    <dd>{user.department?.name ?? 'N/A'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Role
                                    </dt>
                                    <dd className="capitalize">
                                        {user.roles?.[0]?.name ?? 'N/A'}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Status
                                    </dt>
                                    <dd
                                        className={
                                            user.is_locked
                                                ? 'text-destructive'
                                                : 'text-green-500'
                                        }
                                    >
                                        {user.is_locked ? 'Locked' : 'Active'}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Failed Logins
                                    </dt>
                                    <dd>{user.failed_login_count}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Last Login
                                    </dt>
                                    <dd>
                                        {user.last_login_at
                                            ? new Date(
                                                  user.last_login_at,
                                              ).toLocaleString()
                                            : 'Never'}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Last IP
                                    </dt>
                                    <dd className="font-mono text-xs">
                                        {user.last_login_ip ?? 'N/A'}
                                    </dd>
                                </div>
                                {user.lock_reason && (
                                    <div className="border-t pt-2">
                                        <dt className="mb-1 text-xs text-muted-foreground">
                                            Lock Reason
                                        </dt>
                                        <dd className="text-xs text-destructive">
                                            {user.lock_reason}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-4 text-sm font-medium">
                                Active Sessions (
                                {user.sessionTracker?.length ?? 0})
                            </h2>
                            <div className="space-y-2">
                                {user.sessionTracker?.map((s) => (
                                    <div
                                        key={s.id}
                                        className="rounded border p-2 text-xs"
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-mono">
                                                {s.ip_address}
                                            </span>
                                            {s.was_force_terminated && (
                                                <span className="text-destructive">
                                                    Terminated
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground">
                                            {new Date(
                                                s.login_at,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 lg:col-span-2">
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-4 text-sm font-medium">
                                Recent Activity
                            </h2>
                            <UserActivityTimeline activity={activity} />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showLock}
                onClose={() => setShowLock(false)}
                onConfirm={() => {
                    router.post(`/admin/users/${user.id}/lock`);
                    setShowLock(false);
                }}
                title="Lock Account?"
                description={`This will lock ${user.name}'s account and terminate all active sessions.`}
                confirmText="Lock Account"
            />

            <ConfirmModal
                open={showUnlock}
                onClose={() => setShowUnlock(false)}
                onConfirm={() => {
                    router.post(`/admin/users/${user.id}/unlock`);
                    setShowUnlock(false);
                }}
                title="Unlock Account?"
                description={`Restore access for ${user.name}?`}
                confirmText="Unlock"
                variant="default"
            />

            <ConfirmModal
                open={showForceLogout}
                onClose={() => setShowForceLogout(false)}
                onConfirm={() => {
                    router.post(`/admin/users/${user.id}/force-logout`);
                    setShowForceLogout(false);
                }}
                title="Force Logout?"
                description={`Terminate all active sessions for ${user.name}.`}
                confirmText="Force Logout"
                variant="destructive"
            />
        </>
    );
}

UsersShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: 'User Details', href: '' },
    ],
};
