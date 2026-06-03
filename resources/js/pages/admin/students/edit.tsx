import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import type { Student, Department } from '@/types';

interface Props {
    student: Student;
    departments: Department[];
}

export default function StudentsEdit({ student, departments }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        department_id: String(student.department_id ?? '0'),
        registration_number: student.registration_number,
        name: student.name,
        email: student.email,
        program: student.program,
        year_of_study: String(student.year_of_study),
        is_active: student.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/students/${student.id}`);
    };

    return (
        <>
            <Head title={`Edit: ${student.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/students">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">
                        Edit Student: {student.name}
                    </h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="registration_number">
                                Registration Number
                            </Label>
                            <Input
                                id="registration_number"
                                value={data.registration_number}
                                onChange={(e) =>
                                    setData(
                                        'registration_number',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                            />
                            {errors.registration_number && (
                                <p className="text-sm text-destructive">
                                    {errors.registration_number}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
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
                            <Label htmlFor="department_id">Department</Label>
                            <Select
                                value={data.department_id}
                                onValueChange={(v) =>
                                    setData('department_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">
                                        No Department
                                    </SelectItem>
                                    {departments.map((d) => (
                                        <SelectItem
                                            key={d.id}
                                            value={String(d.id)}
                                        >
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="program">Program</Label>
                            <Input
                                id="program"
                                value={data.program}
                                onChange={(e) =>
                                    setData('program', e.target.value)
                                }
                            />
                            {errors.program && (
                                <p className="text-sm text-destructive">
                                    {errors.program}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="year_of_study">Year of Study</Label>
                            <Input
                                id="year_of_study"
                                type="number"
                                min="1"
                                max="10"
                                value={data.year_of_study}
                                onChange={(e) =>
                                    setData('year_of_study', e.target.value)
                                }
                            />
                            {errors.year_of_study && (
                                <p className="text-sm text-destructive">
                                    {errors.year_of_study}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData('is_active', checked as boolean)
                                }
                            />
                            <Label htmlFor="is_active">Active Student</Label>
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Student'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

StudentsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Students', href: '/admin/students' },
        { title: 'Edit', href: '' },
    ],
};
