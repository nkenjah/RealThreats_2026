import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { FundSource, ScholarshipAward, Student } from '@/types';

interface Props {
    fundSource: FundSource & {
        scholarship_awards: (ScholarshipAward & { student?: Student })[];
    };
}

export default function FundSourcesShow({ fundSource }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Fund Source: ${fundSource.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/fund-sources">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {fundSource.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {fundSource.is_active ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDelete(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">Details</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">ID</dt>
                                <dd>{fundSource.id}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd>{fundSource.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Description
                                </dt>
                                <dd>{fundSource.description ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Total Fund
                                </dt>
                                <dd>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'TZS',
                                    }).format(fundSource.total_fund)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Remaining Balance
                                </dt>
                                <dd>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'TZS',
                                    }).format(fundSource.remaining_balance)}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Active
                                </dt>
                                <dd>{fundSource.is_active ? 'Yes' : 'No'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Scholarship Awards
                        </h2>
                        {fundSource.scholarship_awards &&
                        fundSource.scholarship_awards.length > 0 ? (
                            <div className="space-y-2">
                                {fundSource.scholarship_awards.map((award) => (
                                    <div
                                        key={award.id}
                                        className="flex items-center justify-between rounded-md border p-3 text-sm"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {award.student?.name ??
                                                    `Award #${award.id}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Intl.NumberFormat(
                                                    'en-US',
                                                    {
                                                        style: 'currency',
                                                        currency: 'TZS',
                                                    },
                                                ).format(award.award_amount)}
                                            </p>
                                        </div>
                                        <span className="text-xs capitalize">
                                            {award.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No scholarship awards.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/fund-sources/${fundSource.id}`);
                    setShowDelete(false);
                }}
                title="Delete Fund Source?"
                description="This will permanently delete this fund source."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

FundSourcesShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Finances', href: '/admin/finances' },
        { title: 'Fund Sources', href: '/admin/fund-sources' },
        { title: 'Fund Source Details', href: '' },
    ],
};
