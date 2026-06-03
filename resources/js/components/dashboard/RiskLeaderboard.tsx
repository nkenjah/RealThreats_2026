import { Link } from '@inertiajs/react';
import type { User } from '@/types';

interface RiskLeaderboardProps {
    users: User[];
}

const riskColor = (score: number) => {
    if (score >= 76) return 'text-destructive';
    if (score >= 61) return 'text-orange-500';
    if (score >= 31) return 'text-yellow-500';
    return 'text-green-500';
};

export default function RiskLeaderboard({ users }: RiskLeaderboardProps) {
    return (
        <div className="space-y-3">
            {users.map((user, i) => (
                <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                    <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {i + 1}
                        </span>
                        <div>
                            <Link
                                href={`/admin/users/${user.id}`}
                                className="text-sm font-medium hover:underline"
                            >
                                {user.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                                {user.department?.name ?? 'No Department'}
                            </p>
                        </div>
                    </div>
                    <span
                        className={`text-lg font-bold ${riskColor(user.risk_score?.current_score ?? 0)}`}
                    >
                        {user.risk_score?.current_score ?? 0}
                    </span>
                </div>
            ))}
            {users.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                    No risk data available
                </div>
            )}
        </div>
    );
}
