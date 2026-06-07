import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function LibraryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        isbn: '',
        title: '',
        author: '',
        category: '',
        total_copies: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/library');
    };

    return (
        <>
            <Head title="Add Book" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/library">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Add Book</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Input
                                id="isbn"
                                value={data.isbn}
                                onChange={(e) =>
                                    setData('isbn', e.target.value)
                                }
                                placeholder="e.g. 978-0-123456-78-9"
                            />
                            {errors.isbn && (
                                <p className="text-sm text-destructive">
                                    {errors.isbn}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Book title"
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                id="author"
                                value={data.author}
                                onChange={(e) =>
                                    setData('author', e.target.value)
                                }
                                placeholder="Author name"
                            />
                            {errors.author && (
                                <p className="text-sm text-destructive">
                                    {errors.author}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={data.category}
                                onValueChange={(v) => setData('category', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="textbook">
                                        Textbook
                                    </SelectItem>
                                    <SelectItem value="reference">
                                        Reference
                                    </SelectItem>
                                    <SelectItem value="fiction">
                                        Fiction
                                    </SelectItem>
                                    <SelectItem value="non-fiction">
                                        Non-Fiction
                                    </SelectItem>
                                    <SelectItem value="journal">
                                        Journal
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-destructive">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="total_copies">Total Copies</Label>
                            <Input
                                id="total_copies"
                                type="number"
                                min="1"
                                value={data.total_copies}
                                onChange={(e) =>
                                    setData('total_copies', e.target.value)
                                }
                            />
                            {errors.total_copies && (
                                <p className="text-sm text-destructive">
                                    {errors.total_copies}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Book'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

LibraryCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Library', href: '/admin/library' },
        { title: 'Add Book', href: '' },
    ],
};
