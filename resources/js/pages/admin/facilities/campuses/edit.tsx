import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Campus {
    id: number;
    name: string;
    code: string;
    address: string | null;
}

interface Props {
    campus: Campus;
}

export default function CampusesEdit({ campus }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: campus.name,
        code: campus.code,
        address: campus.address ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/campuses/${campus.id}`);
    };

    return (
        <>
            <Head title="Edit Campus" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/campuses">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Campus</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Campus Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
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
                            />
                            {errors.code && (
                                <p className="text-sm text-destructive">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                            />
                            {errors.address && (
                                <p className="text-sm text-destructive">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Campus'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

CampusesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Campuses', href: '/admin/campuses' },
        { title: 'Edit', href: '' },
    ],
};
