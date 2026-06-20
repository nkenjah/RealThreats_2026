import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

interface HESLBAllocation {
    id: number;
    student_id: number;
    heslb_ref_number: string;
    academic_year: string;
    tuition_amount: number;
    meals_amount: number;
    accommodation_amount: number;
    books_amount: number;
    total_amount: number;
    disbursement_status: string;
    student?: { id: number; name: string; registration_number: string };
}

interface Student {
    id: number;
    name: string;
    registration_number: string;
}

interface Props {
    allocation: HESLBAllocation;
    students: Student[];
}

export default function Edit({ allocation, students }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: String(allocation.student_id),
        heslb_ref_number: allocation.heslb_ref_number,
        academic_year: allocation.academic_year,
        tuition_amount: String(allocation.tuition_amount),
        meals_amount: String(allocation.meals_amount),
        accommodation_amount: String(allocation.accommodation_amount),
        books_amount: String(allocation.books_amount),
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
        put(`/admin/heslb-allocations/${allocation.id}`);
    };

    return (
        <>
            <Head title="Edit HESLB Allocation" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Edit HESLB Allocation</h1>

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
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.registration_number})
                                </option>
                            ))}
                        </select>
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
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="academic_year">Academic Year</Label>
                        <Input
                            id="academic_year"
                            value={data.academic_year}
                            onChange={(e) =>
                                setData('academic_year', e.target.value)
                            }
                        />
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
                        </div>
                    ))}

                    <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-sm font-medium">
                            Total: TZS {total.toLocaleString()}
                        </p>
                    </div>

                    <Button disabled={processing}>Update Allocation</Button>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'HESLB', href: '/admin/heslb-allocations' },
        { title: 'Edit', href: '#' },
    ],
};
