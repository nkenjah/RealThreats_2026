import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ScratchCard {
    id: number;
    pin: string;
    serial_number: string;
    value: number;
    currency: string;
    status: string;
    expires_at: string | null;
    used_at: string | null;
    created_at: string;
    issuer?: { id: number; name: string };
    redeemer?: { id: number; name: string };
}

interface Props {
    card: ScratchCard;
}

export default function ScratchCardsShow({ card }: Props) {
    const statusColors: Record<string, string> = {
        active: 'text-green-700 bg-green-50 border-green-200',
        used: 'text-gray-700 bg-gray-50 border-gray-200',
        expired: 'text-red-700 bg-red-50 border-red-200',
        revoked: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    };

    return (
        <>
            <Head title={`Scratch Card ${card.serial_number}`} />
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/admin/scratch-cards">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Scratch Card</h1>
                        <p className="text-sm text-muted-foreground">
                            {card.serial_number}
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border p-8">
                    <div className="mb-6 text-center">
                        <span
                            className={`inline-block rounded-full border px-4 py-1 text-sm font-medium ${statusColors[card.status]}`}
                        >
                            {card.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="mb-8 text-center">
                        <p className="mb-1 text-xs text-muted-foreground">
                            PIN
                        </p>
                        <p className="font-mono text-3xl tracking-[0.5em]">
                            {card.pin}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-muted-foreground">
                                Serial Number
                            </p>
                            <p className="font-medium">{card.serial_number}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Value</p>
                            <p className="font-medium">
                                {new Intl.NumberFormat('en-TZ', {
                                    style: 'currency',
                                    currency: card.currency,
                                }).format(card.value)}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Issued By</p>
                            <p className="font-medium">
                                {card.issuer?.name ?? '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Issued On</p>
                            <p className="font-medium">
                                {new Date(card.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        {card.expires_at && (
                            <div>
                                <p className="text-muted-foreground">Expires</p>
                                <p className="font-medium">
                                    {new Date(
                                        card.expires_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        {card.used_at && (
                            <>
                                <div>
                                    <p className="text-muted-foreground">
                                        Used By
                                    </p>
                                    <p className="font-medium">
                                        {card.redeemer?.name ?? '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">
                                        Used On
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            card.used_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {card.status === 'active' && (
                        <div className="mt-8 flex justify-center">
                            <form
                                method="POST"
                                action={`/admin/scratch-cards/${card.id}`}
                            >
                                <input
                                    type="hidden"
                                    name="_method"
                                    value="DELETE"
                                />
                                <input
                                    type="hidden"
                                    name="_token"
                                    value={
                                        document
                                            .querySelector(
                                                'meta[name=csrf-token]',
                                            )
                                            ?.getAttribute('content') ?? ''
                                    }
                                />
                                <Button variant="destructive" type="submit">
                                    Revoke Card
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
