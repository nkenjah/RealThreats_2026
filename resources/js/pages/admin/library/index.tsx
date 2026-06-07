import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

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
}

export default function LibraryIndex({ books, filters }: Props) {
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
                    <Button asChild>
                        <Link href="/admin/library/create">
                            <Plus className="mr-2 h-4 w-4" /> Add Book
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={books}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by title, author, or ISBN..."
                />
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
