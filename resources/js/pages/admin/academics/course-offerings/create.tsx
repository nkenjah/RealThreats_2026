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

interface Course {
    id: number;
    name: string;
    code: string;
}

interface Program {
    id: number;
    name: string;
}

interface Props {
    courses: Course[];
    programs: Program[];
}

export default function OfferingsCreate({ courses, programs }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        course_id: '',
        program_id: '',
        academic_year: new Date().getFullYear().toString(),
        semester: '1',
        section: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/offerings');
    };

    return (
        <>
            <Head title="Create Offering" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/offerings">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Offering</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="course_id">Course</Label>
                            <Select
                                value={data.course_id}
                                onValueChange={(v) => setData('course_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {c.code} - {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.course_id && (
                                <p className="text-sm text-destructive">
                                    {errors.course_id}
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
                            <Label htmlFor="academic_year">Academic Year</Label>
                            <Input
                                id="academic_year"
                                value={data.academic_year}
                                onChange={(e) =>
                                    setData('academic_year', e.target.value)
                                }
                                placeholder="e.g. 2024/2025"
                            />
                            {errors.academic_year && (
                                <p className="text-sm text-destructive">
                                    {errors.academic_year}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select
                                value={data.semester}
                                onValueChange={(v) => setData('semester', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">
                                        Semester 1
                                    </SelectItem>
                                    <SelectItem value="2">
                                        Semester 2
                                    </SelectItem>
                                    <SelectItem value="3">
                                        Semester 3
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.semester && (
                                <p className="text-sm text-destructive">
                                    {errors.semester}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="section">Section</Label>
                            <Input
                                id="section"
                                value={data.section}
                                onChange={(e) =>
                                    setData('section', e.target.value)
                                }
                                placeholder="e.g. A, B, C"
                            />
                            {errors.section && (
                                <p className="text-sm text-destructive">
                                    {errors.section}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Offering'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

OfferingsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Offerings', href: '/admin/offerings' },
        { title: 'Create', href: '' },
    ],
};
