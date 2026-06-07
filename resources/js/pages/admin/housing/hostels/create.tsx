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
}

interface Props {
    dormitories: Dormitory[];
}

export default function HostelsCreate({ dormitories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        dormitory_id: '',
        capacity: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/hostels');
    };

    return (
        <>
            <Head title="Create Hostel" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/hostels">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Hostel</h1>
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
                                placeholder="e.g. Block A"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dormitory_id">Dormitory</Label>
                            <Select
                                value={data.dormitory_id}
                                onValueChange={(v) =>
                                    setData('dormitory_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select dormitory" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dormitories.map((d) => (
                                        <SelectItem
                                            key={d.id}
                                            value={String(d.id)}
                                        >
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.dormitory_id && (
                                <p className="text-sm text-destructive">
                                    {errors.dormitory_id}
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
                                placeholder="e.g. 50"
                            />
                            {errors.capacity && (
                                <p className="text-sm text-destructive">
                                    {errors.capacity}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Hostel'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

HostelsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Hostels', href: '/admin/hostels' },
        { title: 'Create', href: '' },
    ],
};
