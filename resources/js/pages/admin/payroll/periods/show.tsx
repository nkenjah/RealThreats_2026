import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Lock } from 'lucide-react';

interface PayrollItem {
    id: number;
    basic_salary: number;
    total_allowances: number;
    total_deductions: number;
    tax: number;
    net_pay: number;
    status: string;
    faculty_staff: {
        id: number;
        staff_number: string;
        user: { id: number; name: string } | null;
    } | null;
}

interface Period {
    id: number;
    month: number;
    year: number;
    status: string;
    processed_at: string | null;
    processed_by: { id: number; name: string } | null;
    items: PayrollItem[];
}

interface Props {
    period: Period;
}

const monthNames = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export default function PayrollPeriodsShow({ period }: Props) {
    const totalNet = period.items.reduce((s, i) => s + i.net_pay, 0);
    const totalTax = period.items.reduce((s, i) => s + i.tax, 0);

    const handleRun = () =>
        router.post(`/admin/payroll/periods/${period.id}/run`);
    const handleFinalize = () =>
        router.post(`/admin/payroll/periods/${period.id}/finalize`);
    const handleClear = () => {
        if (confirm('Clear all items in this period? This cannot be undone.')) {
            router.delete(`/admin/payroll/periods/${period.id}`);
        }
    };

    return (
        <>
            <Head
                title={`${monthNames[period.month]} ${period.year} Payroll`}
            />
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/admin/payroll/periods">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {monthNames[period.month]} {period.year}
                        </h1>
                        <p className="text-sm text-muted-foreground capitalize">
                            Status: {period.status}
                        </p>
                    </div>
                    {period.status === 'draft' && (
                        <div className="flex gap-2">
                            {period.items.length === 0 && (
                                <Button onClick={handleRun}>
                                    <Play className="mr-2 size-4" /> Run Payroll
                                </Button>
                            )}
                            {period.items.length > 0 && (
                                <Button onClick={handleFinalize}>
                                    <Lock className="mr-2 size-4" /> Finalize
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">
                            Staff Count
                        </p>
                        <p className="text-2xl font-bold">
                            {period.items.length}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">
                            Total Net Pay
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                            TZS {totalNet.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-xs text-muted-foreground">
                            Total Tax
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                            TZS {totalTax.toLocaleString()}
                        </p>
                    </div>
                </div>

                {period.items.length === 0 ? (
                    <div className="rounded-lg border p-12 text-center text-muted-foreground">
                        No payroll items yet. Click "Run Payroll" to calculate.
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 text-left">
                                    <th className="p-3 font-medium">Staff</th>
                                    <th className="p-3 font-medium">
                                        Staff No
                                    </th>
                                    <th className="p-3 text-right font-medium">
                                        Basic
                                    </th>
                                    <th className="p-3 text-right font-medium">
                                        Allowances
                                    </th>
                                    <th className="p-3 text-right font-medium">
                                        Tax
                                    </th>
                                    <th className="p-3 text-right font-medium">
                                        Net Pay
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {period.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="p-3">
                                            {item.faculty_staff?.user?.name ??
                                                'N/A'}
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {item.faculty_staff?.staff_number ??
                                                '—'}
                                        </td>
                                        <td className="p-3 text-right font-mono">
                                            TZS{' '}
                                            {item.basic_salary.toLocaleString()}
                                        </td>
                                        <td className="p-3 text-right font-mono">
                                            TZS{' '}
                                            {item.total_allowances.toLocaleString()}
                                        </td>
                                        <td className="p-3 text-right font-mono text-red-600">
                                            {item.tax > 0
                                                ? `TZS ${item.tax.toLocaleString()}`
                                                : '—'}
                                        </td>
                                        <td className="p-3 text-right font-mono font-bold">
                                            TZS {item.net_pay.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
