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

interface Student {
    id: number;
    name: string;
    registration_number: string;
}

interface FundSource {
    id: number;
    name: string;
}

interface Props {
    students: Student[];
    fundSources: FundSource[];
}

export default function ScholarshipsCreate({ students, fundSources }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        fund_source_id: '',
        award_amount: '',
        award_date: new Date().toISOString().split('T')[0],
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/scholarship-awards');
    };

    return (
        <>
            <Head title="Create Scholarship" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/scholarship-awards">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Scholarship</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="student_id">Student</Label>
                            <Select
                                value={data.student_id}
                                onValueChange={(v) => setData('student_id', v)}
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
                            {errors.student_id && (
                                <p className="text-sm text-destructive">
                                    {errors.student_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fund_source_id">Fund Source</Label>
                            <Select
                                value={data.fund_source_id}
                                onValueChange={(v) =>
                                    setData('fund_source_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select fund source" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fundSources.map((fs) => (
                                        <SelectItem
                                            key={fs.id}
                                            value={String(fs.id)}
                                        >
                                            {fs.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.fund_source_id && (
                                <p className="text-sm text-destructive">
                                    {errors.fund_source_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="award_amount">Award Amount</Label>
                            <Input
                                id="award_amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.award_amount}
                                onChange={(e) =>
                                    setData('award_amount', e.target.value)
                                }
                            />
                            {errors.award_amount && (
                                <p className="text-sm text-destructive">
                                    {errors.award_amount}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="award_date">Award Date</Label>
                            <Input
                                id="award_date"
                                type="date"
                                value={data.award_date}
                                onChange={(e) =>
                                    setData('award_date', e.target.value)
                                }
                            />
                            {errors.award_date && (
                                <p className="text-sm text-destructive">
                                    {errors.award_date}
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
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Scholarship'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

ScholarshipsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Scholarships', href: '/admin/scholarship-awards' },
        { title: 'Create', href: '' },
    ],
};
