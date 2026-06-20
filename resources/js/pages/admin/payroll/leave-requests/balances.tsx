import { Head } from '@inertiajs/react';
import DataTable from '@/components/shared/DataTable';

interface Balance {
    id: number;
    year: number;
    annual_entitled: number;
    annual_taken: number;
    sick_entitled: number;
    sick_taken: number;
    study_entitled: number;
    study_taken: number;
    compassionate_taken: number;
    faculty_staff: {
        id: number;
        staff_number: string;
        user: { id: number; name: string } | null;
    } | null;
}

interface Props {
    balances: any;
    filters: Record<string, string | undefined>;
    currentYear: number;
}

export default function LeaveBalancesIndex({
    balances,
    filters,
    currentYear,
}: Props) {
    const columns = [
        {
            key: 'staff',
            label: 'Staff',
            render: (b: Balance) => b.faculty_staff?.user?.name ?? '—',
        },
        { key: 'year', label: 'Year' },
        {
            key: 'annual',
            label: 'Annual (Remaining)',
            render: (b: Balance) =>
                `${b.annual_taken}/${b.annual_entitled} (${b.annual_entitled - b.annual_taken})`,
        },
        {
            key: 'sick',
            label: 'Sick (Remaining)',
            render: (b: Balance) =>
                `${b.sick_taken}/${b.sick_entitled} (${b.sick_entitled - b.sick_taken})`,
        },
        {
            key: 'study',
            label: 'Study',
            render: (b: Balance) =>
                b.study_taken > 0
                    ? `${b.study_taken}/${b.study_entitled}`
                    : '—',
        },
        {
            key: 'compassionate',
            label: 'Compassionate',
            render: (b: Balance) =>
                b.compassionate_taken > 0 ? String(b.compassionate_taken) : '—',
        },
    ];

    return (
        <>
            <Head title="Leave Balances" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Leave Balances</h1>
                <p className="text-sm text-muted-foreground">
                    Staff leave entitlement and usage
                </p>
            </div>
            <DataTable
                columns={columns}
                data={balances}
                filters={filters}
                searchPlaceholder="Search by year..."
            />
        </>
    );
}
