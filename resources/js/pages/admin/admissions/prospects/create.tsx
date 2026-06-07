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

export default function ProspectsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        high_school: '',
        gpa: '',
        entry_term: '',
        status: 'new',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/admissions/prospects');
    };

    return (
        <>
            <Head title="Create Prospect" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/admissions/prospects">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Prospect</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                            />
                            {errors.first_name && (
                                <p className="text-sm text-destructive">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                            />
                            {errors.last_name && (
                                <p className="text-sm text-destructive">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                            {errors.phone && (
                                <p className="text-sm text-destructive">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="high_school">High School</Label>
                            <Input
                                id="high_school"
                                value={data.high_school}
                                onChange={(e) =>
                                    setData('high_school', e.target.value)
                                }
                            />
                            {errors.high_school && (
                                <p className="text-sm text-destructive">
                                    {errors.high_school}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gpa">GPA</Label>
                            <Input
                                id="gpa"
                                type="number"
                                step="0.01"
                                min="0"
                                max="4"
                                value={data.gpa}
                                onChange={(e) => setData('gpa', e.target.value)}
                            />
                            {errors.gpa && (
                                <p className="text-sm text-destructive">
                                    {errors.gpa}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="entry_term">Entry Term</Label>
                            <Input
                                id="entry_term"
                                value={data.entry_term}
                                onChange={(e) =>
                                    setData('entry_term', e.target.value)
                                }
                                placeholder="e.g. Fall 2026"
                            />
                            {errors.entry_term && (
                                <p className="text-sm text-destructive">
                                    {errors.entry_term}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="contacted">
                                        Contacted
                                    </SelectItem>
                                    <SelectItem value="applied">
                                        Applied
                                    </SelectItem>
                                    <SelectItem value="qualified">
                                        Qualified
                                    </SelectItem>
                                    <SelectItem value="disqualified">
                                        Disqualified
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                rows={4}
                            />
                            {errors.notes && (
                                <p className="text-sm text-destructive">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Prospect'}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/admin/admissions/prospects">
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

ProspectsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions' },
        { title: 'Prospects', href: '/admin/admissions/prospects' },
        { title: 'Create', href: '' },
    ],
};
