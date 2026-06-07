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

interface Campus {
    id: number;
    name: string;
}

interface Props {
    campuses: Campus[];
}

export default function BuildingsCreate({ campuses }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        campus_id: '',
        name: '',
        code: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/buildings');
    };

    return (
        <>
            <Head title="Create Building" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/buildings">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Building</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="campus_id">Campus</Label>
                            <Select
                                value={data.campus_id}
                                onValueChange={(v) => setData('campus_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select campus" />
                                </SelectTrigger>
                                <SelectContent>
                                    {campuses.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.campus_id && (
                                <p className="text-sm text-destructive">
                                    {errors.campus_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Building Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. Science Building"
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
                                placeholder="e.g. SCI"
                            />
                            {errors.code && (
                                <p className="text-sm text-destructive">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Building'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

BuildingsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Buildings', href: '/admin/buildings' },
        { title: 'Create', href: '' },
    ],
};
