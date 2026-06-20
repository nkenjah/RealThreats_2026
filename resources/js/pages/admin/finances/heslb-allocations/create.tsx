import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';

interface Student {
    id: number;
    name: string;
    registration_number: string;
}

interface Props {
    students: Student[];
}

export default function Create({ students }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        heslb_ref_number: '',
        academic_year: '',
        tuition_amount: '0',
        meals_amount: '0',
        accommodation_amount: '0',
        books_amount: '0',
    });

    const total = [
        'tuition_amount',
        'meals_amount',
        'accommodation_amount',
        'books_amount',
    ].reduce(
        (sum, key) =>
            sum + (parseFloat(data[key as keyof typeof data] as string) || 0),
        0,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/heslb-allocations');
    };

    return (
        <>
            <Head title="Create HESLB Allocation" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Create HESLB Allocation</h1>

                <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="student_id">Student</Label>
                        <select
                            id="student_id"
                            value={data.student_id}
                            onChange={(e) =>
                                setData('student_id', e.target.value)
                            }
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                        >
                            <option value="">Select student...</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.registration_number})
                                </option>
                            ))}
                        </select>
                        {errors.student_id && (
                            <p className="text-sm text-red-500">
                                {errors.student_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="heslb_ref_number">
                            HESLB Reference Number
                        </Label>
                        <Input
                            id="heslb_ref_number"
                            value={data.heslb_ref_number}
                            onChange={(e) =>
                                setData('heslb_ref_number', e.target.value)
                            }
                        />
                        {errors.heslb_ref_number && (
                            <p className="text-sm text-red-500">
                                {errors.heslb_ref_number}
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
                            placeholder="e.g., 2025/2026"
                        />
                        {errors.academic_year && (
                            <p className="text-sm text-red-500">
                                {errors.academic_year}
                            </p>
                        )}
                    </div>

                    {(
                        [
                            'tuition_amount',
                            'meals_amount',
                            'accommodation_amount',
                            'books_amount',
                        ] as const
                    ).map((field) => (
                        <div key={field} className="grid gap-2">
                            <Label htmlFor={field}>
                                {field
                                    .replace('_', ' ')
                                    .replace(/\b\w/g, (c) =>
                                        c.toUpperCase(),
                                    )}{' '}
                                (TZS)
                            </Label>
                            <Input
                                id={field}
                                type="number"
                                min="0"
                                value={data[field]}
                                onChange={(e) => setData(field, e.target.value)}
                            />
                            {errors[field] && (
                                <p className="text-sm text-red-500">
                                    {errors[field]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-sm font-medium">
                            Total: TZS {total.toLocaleString()}
                        </p>
                    </div>

                    <Button disabled={processing}>Create Allocation</Button>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'HESLB', href: '/admin/heslb-allocations' },
        { title: 'Create', href: '/admin/heslb-allocations/create' },
    ],
};
