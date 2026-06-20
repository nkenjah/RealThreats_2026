import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataTable from '@/components/shared/DataTable';

interface Period {
    id: number;
    month: number;
    year: number;
    status: string;
    processed_at: string | null;
    processed_by: { id: number; name: string } | null;
}

interface Props {
    periods: any;
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

export default function PayrollPeriodsIndex({ periods }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        month: String(new Date().getMonth() + 1),
        year: String(new Date().getFullYear()),
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/payroll/periods');
    };

    const statusColors: Record<string, string> = {
        draft: 'text-yellow-600 bg-yellow-50',
        finalized: 'text-green-600 bg-green-50',
    };

    const columns = [
        {
            key: 'period',
            label: 'Period',
            render: (p: Period) => (
                <Link
                    href={`/admin/payroll/periods/${p.id}`}
                    className="font-medium hover:underline"
                >
                    {monthNames[p.month]} {p.year}
                </Link>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (p: Period) => (
                <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[p.status] || ''}`}
                >
                    {p.status}
                </span>
            ),
        },
        {
            key: 'processed_by',
            label: 'Processed By',
            render: (p: Period) => p.processed_by?.name ?? '—',
        },
        {
            key: 'processed_at',
            label: 'Processed',
            render: (p: Period) =>
                p.processed_at
                    ? new Date(p.processed_at).toLocaleDateString()
                    : '—',
        },
    ];

    return (
        <>
            <Head title="Payroll Periods" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Payroll Periods</h1>
                <p className="text-sm text-muted-foreground">
                    Manage monthly payroll runs
                </p>
            </div>

            <form
                onSubmit={handleCreate}
                className="mb-6 flex items-end gap-4 rounded-lg border p-4"
            >
                <div>
                    <Label>Month</Label>
                    <Input
                        type="number"
                        min="1"
                        max="12"
                        value={data.month}
                        onChange={(e) => setData('month', e.target.value)}
                        className="w-24"
                    />
                </div>
                <div>
                    <Label>Year</Label>
                    <Input
                        type="number"
                        min="2020"
                        max="2099"
                        value={data.year}
                        onChange={(e) => setData('year', e.target.value)}
                        className="w-24"
                    />
                </div>
                <Button disabled={processing}>Create Period</Button>
                {errors.month && (
                    <p className="text-sm text-red-500">{errors.month}</p>
                )}
            </form>

            <DataTable columns={columns} data={periods} filters={{}} />
        </>
    );
}
