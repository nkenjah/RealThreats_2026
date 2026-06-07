import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface FundSource {
    id: number;
    name: string;
}

interface Scholarship {
    id: number;
    student_id: number;
    award_amount: number;
    status: string;
    award_date: string | null;
    student?: { id: number; name: string; registration_number: string };
    fundSource?: FundSource;
}

interface Props {
    scholarshipAward: Scholarship;
}

export default function ScholarshipsShow({ scholarshipAward }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Scholarship Details" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/scholarship-awards">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {scholarshipAward.fundSource?.name ?? 'Scholarship'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {scholarshipAward.student?.name ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDelete(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Scholarship Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Student
                                </dt>
                                <dd>
                                    {scholarshipAward.student?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Fund Source
                                </dt>
                                <dd>
                                    {scholarshipAward.fundSource?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Amount
                                </dt>
                                <dd>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'TZS',
                                    }).format(scholarshipAward.award_amount)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="capitalize">
                                    {scholarshipAward.status}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Award Date
                                </dt>
                                <dd>
                                    {scholarshipAward.award_date
                                        ? new Date(
                                              scholarshipAward.award_date,
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/scholarship-awards/${scholarshipAward.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Scholarship?"
                description="This will permanently delete this scholarship record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

ScholarshipsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Scholarships', href: '/admin/scholarship-awards' },
        { title: 'Scholarship Details', href: '' },
    ],
};
