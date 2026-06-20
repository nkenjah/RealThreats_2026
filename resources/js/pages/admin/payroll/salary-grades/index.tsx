import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';

interface Allowance {
    name: string;
    amount: number;
}

interface Grade {
    id: number;
    grade: string;
    basic_salary: number;
    allowances: Allowance[] | null;
    description: string | null;
}

interface Props {
    grades: Grade[];
}

export default function SalaryGradesIndex({ grades }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        grade: '',
        basic_salary: '',
        allowances: [] as Allowance[],
        description: '',
    });

    const addAllowance = () => {
        setData('allowances', [...data.allowances, { name: '', amount: 0 }]);
    };

    const removeAllowance = (i: number) => {
        setData(
            'allowances',
            data.allowances.filter((_, idx) => idx !== i),
        );
    };

    const updateAllowance = (
        i: number,
        field: keyof Allowance,
        value: string | number,
    ) => {
        const updated = [...data.allowances];
        updated[i] = { ...updated[i], [field]: value };
        setData('allowances', updated);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/payroll/salary-grades', {
            onSuccess: () => {
                reset();
                setShowCreate(false);
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/payroll/salary-grades/${editingId}`, {
            onSuccess: () => {
                reset();
                setEditingId(null);
            },
        });
    };

    const startEdit = (g: Grade) => {
        setEditingId(g.id);
        setData({
            grade: g.grade,
            basic_salary: String(g.basic_salary),
            allowances: g.allowances ?? [],
            description: g.description ?? '',
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this salary grade?')) {
            destroy(`/admin/payroll/salary-grades/${id}`);
        }
    };

    const formFields = (
        onSubmit: (e: React.FormEvent) => void,
        isEdit: boolean,
    ) => (
        <form
            onSubmit={onSubmit}
            className="mb-6 space-y-4 rounded-lg border p-4"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Grade</Label>
                    <Input
                        value={data.grade}
                        onChange={(e) => setData('grade', e.target.value)}
                        placeholder="e.g. Grade A"
                    />
                    {errors.grade && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.grade}
                        </p>
                    )}
                </div>
                <div>
                    <Label>Basic Salary (TZS)</Label>
                    <Input
                        type="number"
                        min="0"
                        value={data.basic_salary}
                        onChange={(e) =>
                            setData('basic_salary', e.target.value)
                        }
                    />
                    {errors.basic_salary && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.basic_salary}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <Label>Allowances</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAllowance}
                    >
                        <Plus className="mr-1 size-3" /> Add
                    </Button>
                </div>
                {data.allowances.map((a, i) => (
                    <div key={i} className="mb-2 flex gap-2">
                        <Input
                            placeholder="Name"
                            value={a.name}
                            onChange={(e) =>
                                updateAllowance(i, 'name', e.target.value)
                            }
                        />
                        <Input
                            type="number"
                            placeholder="Amount"
                            value={a.amount}
                            onChange={(e) =>
                                updateAllowance(
                                    i,
                                    'amount',
                                    Number(e.target.value),
                                )
                            }
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAllowance(i)}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <div>
                <Label>Description</Label>
                <Input
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset();
                        setShowCreate(false);
                        setEditingId(null);
                    }}
                >
                    Cancel
                </Button>
                <Button disabled={processing}>
                    {isEdit ? 'Update' : 'Create'} Grade
                </Button>
            </div>
        </form>
    );

    return (
        <>
            <Head title="Salary Grades" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Salary Grades</h1>
                    <p className="text-sm text-muted-foreground">
                        Define salary scales and allowances
                    </p>
                </div>
                {!showCreate && (
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 size-4" /> Add Grade
                    </Button>
                )}
            </div>

            {showCreate && formFields(handleCreate, false)}

            {grades.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-muted-foreground">
                    No salary grades defined yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {grades.map((g) => (
                        <div key={g.id} className="rounded-lg border p-4">
                            {editingId === g.id ? (
                                formFields(handleUpdate, true)
                            ) : (
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold">
                                            {g.grade}
                                        </h3>
                                        <p className="text-sm">
                                            Basic:{' '}
                                            <span className="font-mono">
                                                TZS{' '}
                                                {g.basic_salary.toLocaleString()}
                                            </span>
                                        </p>
                                        {g.allowances &&
                                            g.allowances.length > 0 && (
                                                <div className="text-sm text-muted-foreground">
                                                    {g.allowances.map(
                                                        (a, i) => (
                                                            <span key={i}>
                                                                {a.name}: TZS{' '}
                                                                {a.amount.toLocaleString()}
                                                                {i <
                                                                g.allowances!
                                                                    .length -
                                                                    1
                                                                    ? ' | '
                                                                    : ''}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        {g.description && (
                                            <p className="text-xs text-muted-foreground">
                                                {g.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => startEdit(g)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(g.id)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
