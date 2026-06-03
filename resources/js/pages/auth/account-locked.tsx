import { Head, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useState } from 'react';

interface AccountLockedProps {
    reason: string;
}

export default function AccountLocked() {
    const { reason } = usePage<{ reason: string }>().props;
    const [email, setEmail] = useState('');
    const [requestReason, setRequestReason] = useState('');
    const [sending, setSending] = useState(false);

    const handleRequestUnlock = () => {
        setSending(true);
        router.post(
            '/account-unlock-request',
            {
                email,
                reason: requestReason,
            },
            {
                onFinish: () => setSending(false),
            },
        );
    };

    return (
        <>
            <Head title="Account Locked" />

            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                <Lock className="h-8 w-8 text-destructive" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">
                                    Account Suspended
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Your account has been locked for security
                                    reasons.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm">
                            <p className="font-medium text-destructive">
                                Reason:
                            </p>
                            <p className="mt-1 text-muted-foreground">
                                {reason}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Your Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@kiut.ac.tz"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="request-reason">
                                    Additional Information
                                </Label>
                                <textarea
                                    id="request-reason"
                                    value={requestReason}
                                    onChange={(e) =>
                                        setRequestReason(e.target.value)
                                    }
                                    placeholder="Optional: provide context for your unlock request..."
                                    className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                    rows={3}
                                />
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleRequestUnlock}
                                disabled={sending || !email}
                            >
                                {sending ? 'Sending...' : 'Request Unlock'}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground">
                                Contact ICT Department:{' '}
                                <a
                                    href="mailto:ict@kiut.ac.tz"
                                    className="text-primary hover:underline"
                                >
                                    ict@kiut.ac.tz
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
