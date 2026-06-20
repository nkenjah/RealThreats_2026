import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface HESLBAllocation {
    id: number;
    heslb_ref_number: string;
    academic_year: string;
    tuition_amount: number;
    meals_amount: number;
    accommodation_amount: number;
    books_amount: number;
    total_amount: number;
    disbursement_status: string;
    last_disbursement_at: string | null;
    created_at: string;
    student?: {
        id: number;
        name: string;
        registration_number: string;
        email: string;
    };
}

interface Props {
    allocation: HESLBAllocation;
}

const formatTZS = (amount: number) =>
    new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
    }).format(amount);

export default function Show({ allocation }: Props) {
    const breakdown = [
        { label: 'Tuition', amount: allocation.tuition_amount },
        { label: 'Meals', amount: allocation.meals_amount },
        { label: 'Accommodation', amount: allocation.accommodation_amount },
        { label: 'Books & Stationery', amount: allocation.books_amount },
    ];

    return (
        <>
            <Head title="HESLB Allocation" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">HESLB Allocation</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={`/admin/heslb-allocations/${allocation.id}/edit`}
                            >
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/heslb-allocations">Back</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold">
                            Student Information
                        </h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd className="font-medium">
                                    {allocation.student?.name}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Reg. Number
                                </dt>
                                <dd className="font-mono">
                                    {allocation.student?.registration_number}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>{allocation.student?.email}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold">
                            Loan Breakdown
                        </h3>
                        <dl className="space-y-2 text-sm">
                            {breakdown.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex justify-between"
                                >
                                    <dt className="text-muted-foreground">
                                        {item.label}
                                    </dt>
                                    <dd className="font-medium">
                                        {formatTZS(item.amount)}
                                    </dd>
                                </div>
                            ))}
                            <div className="border-t pt-2">
                                <div className="flex justify-between font-bold">
                                    <dt>Total</dt>
                                    <dd>
                                        {formatTZS(allocation.total_amount)}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-xl border bg-card p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold">
                            Allocation Details
                        </h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    HESLB Ref
                                </dt>
                                <dd className="font-mono">
                                    {allocation.heslb_ref_number}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Academic Year
                                </dt>
                                <dd>{allocation.academic_year}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">
                                    {allocation.disbursement_status}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Last Disbursement
                                </dt>
                                <dd>
                                    {allocation.last_disbursement_at
                                        ? new Date(
                                              allocation.last_disbursement_at,
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Created
                                </dt>
                                <dd>
                                    {new Date(
                                        allocation.created_at,
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'HESLB', href: '/admin/heslb-allocations' },
        { title: 'Allocation', href: '#' },
    ],
};
