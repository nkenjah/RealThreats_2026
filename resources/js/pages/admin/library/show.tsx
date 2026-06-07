import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit2, Trash2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Borrowing {
    id: number;
    book_id: number;
    student_id: number;
    borrowed_at: string;
    due_at: string;
    returned_at: string | null;
    student?: { id: number; name: string; registration_number: string };
}

interface Book {
    id: number;
    isbn: string;
    title: string;
    author: string;
    category: string;
    total_copies: number;
    available_copies: number;
    borrowings?: Borrowing[];
}

interface Student {
    id: number;
    name: string;
    registration_number: string;
}

interface Props {
    book: Book;
    students: Student[];
}

export default function LibraryShow({ book, students }: Props) {
    const [showDelete, setShowDelete] = useState(false);
    const [showBorrow, setShowBorrow] = useState(false);

    const [borrowData, setBorrowData] = useState({
        student_id: '',
        due_at: '',
    });
    const [borrowing, setBorrowing] = useState(false);

    const handleBorrow = () => {
        setBorrowing(true);
        router.post(`/admin/library/${book.id}/borrow`, borrowData, {
            onFinish: () => {
                setBorrowing(false);
                setShowBorrow(false);
            },
        });
    };

    return (
        <>
            <Head title={`Book: ${book.title}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/library">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{book.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            by {book.author}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowBorrow(true)}
                        >
                            <BookOpen className="mr-2 h-4 w-4" /> Record
                            Borrowing
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/library/${book.id}/edit`}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </Button>
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
                            Book Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">ISBN</dt>
                                <dd className="font-mono">{book.isbn}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Title</dt>
                                <dd>{book.title}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Author
                                </dt>
                                <dd>{book.author}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Category
                                </dt>
                                <dd>{book.category}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Total Copies
                                </dt>
                                <dd>{book.total_copies}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Available Copies
                                </dt>
                                <dd>{book.available_copies}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Borrowings</h2>
                    {book.borrowings && book.borrowings.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Student
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Borrowed At
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Due At
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Returned At
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {book.borrowings.map((b) => (
                                    <tr
                                        key={b.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-3 py-2">
                                            {b.student?.name ?? 'N/A'}
                                        </td>
                                        <td className="px-3 py-2">
                                            {new Date(
                                                b.borrowed_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 py-2">
                                            {new Date(
                                                b.due_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 py-2">
                                            {b.returned_at ? (
                                                new Date(
                                                    b.returned_at,
                                                ).toLocaleDateString()
                                            ) : (
                                                <span className="text-amber-500">
                                                    Not returned
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No borrowings found.
                        </p>
                    )}
                </div>
            </div>

            <Dialog open={showBorrow} onOpenChange={setShowBorrow}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Borrowing</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="borrow-student">Student</Label>
                            <Select
                                value={borrowData.student_id}
                                onValueChange={(v) =>
                                    setBorrowData((prev) => ({
                                        ...prev,
                                        student_id: v,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (
                                        <SelectItem
                                            key={s.id}
                                            value={String(s.id)}
                                        >
                                            {s.name} ({s.registration_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="borrow-due">Due Date</Label>
                            <Input
                                id="borrow-due"
                                type="date"
                                value={borrowData.due_at}
                                onChange={(e) =>
                                    setBorrowData((prev) => ({
                                        ...prev,
                                        due_at: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowBorrow(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleBorrow} disabled={borrowing}>
                            {borrowing ? 'Processing...' : 'Confirm Borrowing'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/library/${book.id}`);
                    setShowDelete(false);
                }}
                title="Delete Book?"
                description="This will permanently delete this book record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

LibraryShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Library', href: '/admin/library' },
        { title: 'Book Details', href: '' },
    ],
};
