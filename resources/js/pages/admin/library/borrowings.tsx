import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/shared/DataTable';
import { BookOpen } from 'lucide-react';

interface Borrowing {
    id: number;
    book_id: number;
    student_id: number;
    borrowed_at: string;
    due_at: string;
    returned_at: string | null;
    book?: { id: number; title: string; isbn: string };
    student?: { id: number; name: string; registration_number: string };
}

interface Props {
    borrowings: any;
    filters: Record<string, string | undefined>;
}

export default function LibraryBorrowings({ borrowings, filters }: Props) {
    const handleReturn = (borrowingId: number) => {
        if (confirm('Mark this book as returned?')) {
            router.post(`/admin/library/borrowings/${borrowingId}/return`);
        }
    };

    const columns = [
        {
            key: 'book',
            label: 'Book',
            render: (b: Borrowing) =>
                b.book?.title ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'student',
            label: 'Student',
            render: (b: Borrowing) =>
                b.student?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'borrowed_at',
            label: 'Borrowed',
            render: (b: Borrowing) =>
                new Date(b.borrowed_at).toLocaleDateString(),
        },
        {
            key: 'due_at',
            label: 'Due',
            render: (b: Borrowing) => new Date(b.due_at).toLocaleDateString(),
        },
        {
            key: 'status',
            label: 'Status',
            render: (b: Borrowing) =>
                b.returned_at ? (
                    <span className="text-green-500">Returned</span>
                ) : (
                    <span className="text-amber-500">Active</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (b: Borrowing) =>
                !b.returned_at && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturn(b.id)}
                    >
                        <BookOpen className="mr-2 h-4 w-4" /> Return Book
                    </Button>
                ),
        },
    ];

    return (
        <>
            <Head title="Borrowings" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Borrowings</h1>
                </div>

                <DataTable
                    data={borrowings}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by book title or student..."
                />
            </div>
        </>
    );
}

LibraryBorrowings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Library', href: '/admin/library' },
        { title: 'Borrowings', href: '/admin/library/borrowings' },
    ],
};
