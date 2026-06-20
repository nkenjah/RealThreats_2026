import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import type { LibraryFine, LibraryBorrowing } from '@/types';

interface Props {
    libraryFine: LibraryFine & {
        library_borrowing: LibraryBorrowing;
    };
}

export default function LibraryFinesShow({ libraryFine }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Library Fine Details" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/library-fines">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Library Fine</h1>
                        <p className="text-sm text-muted-foreground">
                            {libraryFine.library_borrowing?.library_book
                                ?.title ?? 'N/A'}
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

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Details</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">ID</dt>
                            <dd>{libraryFine.id}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Amount</dt>
                            <dd>
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'TZS',
                                }).format(libraryFine.amount)}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Paid</dt>
                            <dd>
                                {libraryFine.paid ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <X className="h-4 w-4 text-destructive" />
                                )}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Paid At</dt>
                            <dd>
                                {libraryFine.paid_at
                                    ? new Date(
                                          libraryFine.paid_at,
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                Borrowing ID
                            </dt>
                            <dd>{libraryFine.library_borrowing_id}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/library-fines/${libraryFine.id}`);
                    setShowDelete(false);
                }}
                title="Delete Fine?"
                description="This will permanently delete this library fine record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

LibraryFinesShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Library', href: '/admin/library' },
        { title: 'Fines', href: '/admin/library-fines' },
        { title: 'Fine Details', href: '' },
    ],
};
