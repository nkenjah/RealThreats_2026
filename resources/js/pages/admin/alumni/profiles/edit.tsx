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

interface Alumni {
    id: number;
    student_id: number;
    graduation_year: number;
    company: string | null;
    job_title: string | null;
    industry: string | null;
    phone: string | null;
    address: string | null;
    bio: string | null;
}

interface Student {
    id: number;
    name: string;
    registration_number: string;
}

interface Props {
    alumniProfile: Alumni;
    students: Student[];
}

export default function AlumniEdit({ alumniProfile, students }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        student_id: String(alumniProfile.student_id),
        graduation_year: String(alumniProfile.graduation_year),
        company: alumniProfile.company ?? '',
        job_title: alumniProfile.job_title ?? '',
        industry: alumniProfile.industry ?? '',
        phone: alumniProfile.phone ?? '',
        address: alumniProfile.address ?? '',
        bio: alumniProfile.bio ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/alumni/${alumniProfile.id}`);
    };

    return (
        <>
            <Head title="Edit Alumni" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/alumni">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Alumni</h1>
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
                            <Label htmlFor="graduation_year">
                                Graduation Year
                            </Label>
                            <Input
                                id="graduation_year"
                                type="number"
                                min="1950"
                                max="2100"
                                value={data.graduation_year}
                                onChange={(e) =>
                                    setData('graduation_year', e.target.value)
                                }
                            />
                            {errors.graduation_year && (
                                <p className="text-sm text-destructive">
                                    {errors.graduation_year}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={data.company}
                                onChange={(e) =>
                                    setData('company', e.target.value)
                                }
                            />
                            {errors.company && (
                                <p className="text-sm text-destructive">
                                    {errors.company}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="job_title">Job Title</Label>
                            <Input
                                id="job_title"
                                value={data.job_title}
                                onChange={(e) =>
                                    setData('job_title', e.target.value)
                                }
                            />
                            {errors.job_title && (
                                <p className="text-sm text-destructive">
                                    {errors.job_title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input
                                id="industry"
                                value={data.industry}
                                onChange={(e) =>
                                    setData('industry', e.target.value)
                                }
                            />
                            {errors.industry && (
                                <p className="text-sm text-destructive">
                                    {errors.industry}
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

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                            />
                            {errors.bio && (
                                <p className="text-sm text-destructive">
                                    {errors.bio}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Alumni'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

AlumniEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Alumni', href: '/admin/alumni' },
        { title: 'Edit', href: '' },
    ],
};
