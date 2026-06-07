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

interface Dormitory {
    id: number;
    name: string;
    code: string;
    capacity: number;
    gender: string | null;
    description: string | null;
}

interface Props {
    dormitory: Dormitory;
}

export default function DormitoriesEdit({ dormitory }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: dormitory.name,
        code: dormitory.code,
        capacity: String(dormitory.capacity),
        gender: dormitory.gender ?? '',
        description: dormitory.description ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/dormitories/${dormitory.id}`);
    };

    return (
        <>
            <Head title="Edit Dormitory" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/dormitories">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Dormitory</h1>
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
                                    setData('code', e.target.value)
                                }
                            />
                            {errors.code && (
                                <p className="text-sm text-destructive">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={data.capacity}
                                onChange={(e) =>
                                    setData('capacity', e.target.value)
                                }
                            />
                            {errors.capacity && (
                                <p className="text-sm text-destructive">
                                    {errors.capacity}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={data.gender}
                                onValueChange={(v) => setData('gender', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && (
                                <p className="text-sm text-destructive">
                                    {errors.gender}
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
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Dormitory'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

DormitoriesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Dormitories', href: '/admin/dormitories' },
        { title: 'Edit', href: '' },
    ],
};
