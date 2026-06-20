import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Table2 } from 'lucide-react';
import { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { LibraryDashboard } from '@/components/library/library-dashboard';

interface Book {
    id: number;
    isbn: string;
    title: string;
    author: string;
    category: string;
    total_copies: number;
    available_copies: number;
}

interface Props {
    books: any;
    filters: Record<string, string | undefined>;
    stats?: {
        total_books: number;
        available: number;
        borrowed: number;
        overdue: number;
        by_category: { category: string; count: number }[];
    };
}

export default function LibraryIndex({ books, filters, stats }: Props) {
    const [view, setView] = useState<'table' | 'dashboard'>('table');

    const columns = [
        {
            key: 'isbn',
            label: 'ISBN',
            render: (book: Book) => (
                <Link
                    href={`/admin/library/${book.id}`}
                    className="font-mono font-medium hover:underline"
                >
                    {book.isbn}
                </Link>
            ),
        },
        {
            key: 'title',
            label: 'Title',
        },
        {
            key: 'author',
            label: 'Author',
        },
        {
            key: 'category',
            label: 'Category',
        },
        {
            key: 'copies',
            label: 'Copies',
            render: (book: Book) => (
                <span>
                    {book.available_copies}/{book.total_copies}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (book: Book) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/library/${book.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/library/${book.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Library" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Library</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border p-0.5">
                            <Button
                                variant={
                                    view === 'dashboard' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('dashboard')}
                                className="h-7 px-2"
                            >
                                <LayoutGrid className="size-4" />
                            </Button>
                            <Button
                                variant={
                                    view === 'table' ? 'secondary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setView('table')}
                                className="h-7 px-2"
                            >
                                <Table2 className="size-4" />
                            </Button>
                        </div>
                        <Button asChild>
                            <Link href="/admin/library/create">
                                <Plus className="mr-2 h-4 w-4" /> Add Book
                            </Link>
                        </Button>
                    </div>
                </div>

                {view === 'dashboard' && stats ? (
                    <LibraryDashboard
                        total_books={stats.total_books}
                        available={stats.available}
                        borrowed={stats.borrowed}
                        overdue={stats.overdue}
                        by_category={stats.by_category}
                    />
                ) : (
                    <DataTable
                        data={books}
                        columns={columns}
                        filters={filters}
                        searchPlaceholder="Search by title, author, or ISBN..."
                    />
                )}
            </div>
        </>
    );
}

LibraryIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Library', href: '/admin/library' },
    ],
};
