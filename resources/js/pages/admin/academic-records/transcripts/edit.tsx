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

interface AcademicTranscript {
    id: number;
    student_id: number;
    program_id: number;
    total_credits_earned: number;
    cumulative_gpa: number;
    generated_at: string;
}

interface Student {
    id: number;
    name: string;
}

interface Program {
    id: number;
    name: string;
}

interface Props {
    academicTranscript: AcademicTranscript;
    students: Student[];
    programs: Program[];
}

export default function TranscriptsEdit({
    academicTranscript,
    students,
    programs,
}: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        student_id: String(academicTranscript.student_id),
        program_id: String(academicTranscript.program_id),
        total_credits_earned: String(academicTranscript.total_credits_earned),
        cumulative_gpa: String(academicTranscript.cumulative_gpa),
        generated_at: academicTranscript.generated_at,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/academics/transcripts/${academicTranscript.id}`);
    };

    return (
        <>
            <Head title="Edit Transcript" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/academics/transcripts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">
                        Edit Academic Transcript
                    </h1>
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
                            />
                            {errors.total_credits_earned && (
                                <p className="text-sm text-destructive">
                                    {errors.total_credits_earned}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cumulative_gpa">
                                Cumulative GPA
                            </Label>
                            <Input
                                id="cumulative_gpa"
                                type="number"
                                step="0.01"
                                value={data.cumulative_gpa}
                                onChange={(e) =>
                                    setData('cumulative_gpa', e.target.value)
                                }
                            />
                            {errors.cumulative_gpa && (
                                <p className="text-sm text-destructive">
                                    {errors.cumulative_gpa}
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
                            {processing ? 'Updating...' : 'Update Transcript'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

TranscriptsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transcripts', href: '/admin/academics/transcripts' },
        { title: 'Edit', href: '' },
    ],
};
