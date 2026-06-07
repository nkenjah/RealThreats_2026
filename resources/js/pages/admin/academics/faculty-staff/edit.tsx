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
import type { Department } from '@/types';

interface Faculty {
    id: number;
    user_id: number | null;
    staff_number: string;
    department_id: number | null;
    job_title: string;
    contract_type: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    facultyStaff: Faculty;
    departments: Department[];
    users: User[];
}

export default function FacultyEdit({
    facultyStaff,
    departments,
    users,
}: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        user_id: String(facultyStaff.user_id ?? ''),
        staff_number: facultyStaff.staff_number,
        department_id: String(facultyStaff.department_id ?? '0'),
        job_title: facultyStaff.job_title,
        contract_type: facultyStaff.contract_type,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/faculty/${facultyStaff.id}`);
    };

    return (
        <>
            <Head title="Edit Faculty" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/faculty">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Faculty</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="user_id">User</Label>
                            <Select
                                value={data.user_id}
                                onValueChange={(v) => setData('user_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem
                                            key={u.id}
                                            value={String(u.id)}
                                        >
                                            {u.name} ({u.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && (
                                <p className="text-sm text-destructive">
                                    {errors.user_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="staff_number">Staff Number</Label>
                            <Input
                                id="staff_number"
                                value={data.staff_number}
                                onChange={(e) =>
                                    setData(
                                        'staff_number',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                            />
                            {errors.staff_number && (
                                <p className="text-sm text-destructive">
                                    {errors.staff_number}
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
                            <Label htmlFor="contract_type">Contract Type</Label>
                            <Select
                                value={data.contract_type}
                                onValueChange={(v) =>
                                    setData('contract_type', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select contract type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="permanent">
                                        Permanent
                                    </SelectItem>
                                    <SelectItem value="contract">
                                        Contract
                                    </SelectItem>
                                    <SelectItem value="part-time">
                                        Part Time
                                    </SelectItem>
                                    <SelectItem value="visiting">
                                        Visiting
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.contract_type && (
                                <p className="text-sm text-destructive">
                                    {errors.contract_type}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Faculty'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

FacultyEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Faculty', href: '/admin/faculty' },
        { title: 'Edit', href: '' },
    ],
};
