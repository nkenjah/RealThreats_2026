import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function ProgramsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        duration_years: '4',
        total_credits: '120',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/programs');
    };

    return (
        <>
            <Head title="Create Program" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/programs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Program</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. Bachelor of Science"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) =>
                                    setData(
                                        'code',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="e.g. BSC"
                            />
                            {errors.code && (
                                <p className="text-sm text-destructive">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Program description..."
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="duration_years">
                                Duration (Years)
                            </Label>
                            <Input
                                id="duration_years"
                                type="number"
                                min="1"
                                max="10"
                                value={data.duration_years}
                                onChange={(e) =>
                                    setData('duration_years', e.target.value)
                                }
                            />
                            {errors.duration_years && (
                                <p className="text-sm text-destructive">
                                    {errors.duration_years}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="total_credits">Total Credits</Label>
                            <Input
                                id="total_credits"
                                type="number"
                                min="1"
                                value={data.total_credits}
                                onChange={(e) =>
                                    setData('total_credits', e.target.value)
                                }
                            />
                            {errors.total_credits && (
                                <p className="text-sm text-destructive">
                                    {errors.total_credits}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Program'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

ProgramsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Programs', href: '/admin/programs' },
        { title: 'Create', href: '' },
    ],
};
