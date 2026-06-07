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
}

interface Program {
    id: number;
    name: string;
}

interface Props {
    students: Student[];
    programs: Program[];
}

export default function DegreeAuditsCreate({ students, programs }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        program_id: '',
        total_credits_required: '',
        total_credits_earned: '',
        status: 'in_progress',
        generated_at: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/academics/degree-audits');
    };

    return (
        <>
            <Head title="Create Degree Audit" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/academics/degree-audits">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Degree Audit</h1>
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
                                            {s.name}
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
                            <Label htmlFor="program_id">Program</Label>
                            <Select
                                value={data.program_id}
                                onValueChange={(v) => setData('program_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={String(p.id)}
                                        >
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.program_id && (
                                <p className="text-sm text-destructive">
                                    {errors.program_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="total_credits_required">
                                Total Credits Required
                            </Label>
                            <Input
                                id="total_credits_required"
                                type="number"
                                value={data.total_credits_required}
                                onChange={(e) =>
                                    setData(
                                        'total_credits_required',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. 120"
                            />
                            {errors.total_credits_required && (
                                <p className="text-sm text-destructive">
                                    {errors.total_credits_required}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="total_credits_earned">
                                Total Credits Earned
                            </Label>
                            <Input
                                id="total_credits_earned"
                                type="number"
                                value={data.total_credits_earned}
                                onChange={(e) =>
                                    setData(
                                        'total_credits_earned',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g. 90"
                            />
                            {errors.total_credits_earned && (
                                <p className="text-sm text-destructive">
                                    {errors.total_credits_earned}
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
                                    <SelectItem value="in_progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="not_enrolled">
                                        Not Enrolled
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
                            <Label htmlFor="generated_at">Generated At</Label>
                            <Input
                                id="generated_at"
                                type="date"
                                value={data.generated_at}
                                onChange={(e) =>
                                    setData('generated_at', e.target.value)
                                }
                            />
                            {errors.generated_at && (
                                <p className="text-sm text-destructive">
                                    {errors.generated_at}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Degree Audit'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

DegreeAuditsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Degree Audits', href: '/admin/academics/degree-audits' },
        { title: 'Create', href: '' },
    ],
};
