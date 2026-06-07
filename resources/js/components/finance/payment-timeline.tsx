import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    CheckCircle,
    Clock,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    CreditCard,
} from 'lucide-react';

interface Payment {
    id: number;
    amount: number;
    method: string;
    reference: string;
    paid_at: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    description: string;
    total: number;
    paid_amount: number;
    due_date: string;
    status: 'paid' | 'pending' | 'overdue';
    payments: Payment[];
}

interface PaymentTimelineProps {
    invoices: Invoice[];
}

const statusConfig = {
    paid: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100 dark:bg-green-900/30',
    },
    pending: {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    overdue: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-100 dark:bg-red-900/30',
    },
};

export function PaymentTimeline({ invoices }: PaymentTimelineProps) {
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const toggleExpand = (id: number) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-4">
            {invoices.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    No invoices found.
                </p>
            )}
            {invoices.map((invoice, idx) => {
                const cfg = statusConfig[invoice.status];
                const StatusIcon = cfg.icon;
                const isExpanded = expanded[invoice.id];
                const isLast = idx === invoices.length - 1;

                return (
                    <div key={invoice.id} className="relative pl-8">
                        {!isLast && (
                            <div className="absolute top-8 bottom-0 left-[15px] w-px bg-border" />
                        )}
                        <div
                            className={cn(
                                'absolute top-1 left-2.5 flex size-6 items-center justify-center rounded-full',
                                cfg.bg,
                            )}
                        >
                            <StatusIcon className={cn('size-3.5', cfg.color)} />
                        </div>

                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">
                                            {invoice.invoice_number}
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full px-2 py-0.5 text-[10px] font-medium capitalize',
                                                cfg.bg,
                                                cfg.color,
                                            )}
                                        >
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {invoice.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggleExpand(invoice.id)}
                                    className="rounded p-1 text-muted-foreground hover:bg-accent"
                                >
                                    {isExpanded ? (
                                        <ChevronUp className="size-4" />
                                    ) : (
                                        <ChevronDown className="size-4" />
                                    )}
                                </button>
                            </div>

                            <div className="mt-2 flex items-center gap-4 text-xs">
                                <span className="text-muted-foreground">
                                    Total:{' '}
                                    <span className="font-medium text-foreground">
                                        ${invoice.total.toFixed(2)}
                                    </span>
                                </span>
                                <span className="text-muted-foreground">
                                    Paid:{' '}
                                    <span className="font-medium text-green-600">
                                        ${invoice.paid_amount.toFixed(2)}
                                    </span>
                                </span>
                                <span className="text-muted-foreground">
                                    Due:{' '}
                                    <span className="font-medium text-foreground">
                                        {invoice.due_date}
                                    </span>
                                </span>
                                {invoice.status === 'overdue' && (
                                    <span className="font-medium text-red-600">
                                        {invoice.total - invoice.paid_amount > 0
                                            ? `$${(invoice.total - invoice.paid_amount).toFixed(2)} overdue`
                                            : 'Overdue'}
                                    </span>
                                )}
                            </div>

                            {isExpanded && invoice.payments.length > 0 && (
                                <div className="mt-3 space-y-2 border-t pt-3">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Payment History
                                    </p>
                                    {invoice.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-xs"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="size-3.5 text-muted-foreground" />
                                                <span className="font-medium">
                                                    ${payment.amount.toFixed(2)}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    via {payment.method}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-muted-foreground">
                                                    {payment.reference}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {payment.paid_at}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isExpanded && invoice.payments.length === 0 && (
                                <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                                    No payments recorded yet.
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
