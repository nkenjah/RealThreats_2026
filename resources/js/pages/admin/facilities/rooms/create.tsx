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

interface Building {
    id: number;
    name: string;
    code: string;
}

interface Props {
    buildings: Building[];
}

export default function RoomsCreate({ buildings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        building_id: '',
        name: '',
        code: '',
        capacity: '30',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/rooms');
    };

    return (
        <>
            <Head title="Create Room" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/rooms">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Room</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="building_id">Building</Label>
                            <Select
                                value={data.building_id}
                                onValueChange={(v) => setData('building_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select building" />
                                </SelectTrigger>
                                <SelectContent>
                                    {buildings.map((b) => (
                                        <SelectItem
                                            key={b.id}
                                            value={String(b.id)}
                                        >
                                            {b.name} ({b.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.building_id && (
                                <p className="text-sm text-destructive">
                                    {errors.building_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Room Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. Lecture Hall 1"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="code">Room Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) =>
                                    setData(
                                        'code',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="e.g. LH-101"
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
                                min="1"
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

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Room'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

RoomsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rooms', href: '/admin/rooms' },
        { title: 'Create', href: '' },
    ],
};
