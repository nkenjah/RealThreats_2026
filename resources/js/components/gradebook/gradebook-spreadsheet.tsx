import { useCallback, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GradeComponent {
    id: number;
    name: string;
    max_score: number;
    weight: number;
}

interface StudentGrade {
    student_id: number;
    student_name: string;
    registration_number: string;
    scores: Record<number, number | null>;
}

interface GradebookSpreadsheetProps {
    components: GradeComponent[];
    students: StudentGrade[];
    gradebook_id: number;
}

export function GradebookSpreadsheet({
    components,
    students,
    gradebook_id,
}: GradebookSpreadsheetProps) {
    const [grades, setGrades] = useState<Record<string, number | null>>(() => {
        const initial: Record<string, number | null> = {};
        for (const student of students) {
            for (const comp of components) {
                const key = `${student.student_id}-${comp.id}`;
                initial[key] = student.scores[comp.id] ?? null;
            }
        }
        return initial;
    });
    const [dirty, setDirty] = useState(false);

    const totalWeight = useMemo(
        () => components.reduce((s, c) => s + c.weight, 0),
        [components],
    );

    const updateGrade = useCallback(
        (studentId: number, componentId: number, value: string) => {
            const num = value === '' ? null : Number(value);
            const key = `${studentId}-${componentId}`;
            setGrades((prev) => ({
                ...prev,
                [key]: isNaN(num as number) ? null : num,
            }));
            setDirty(true);
        },
        [],
    );

    const calcWeightedTotal = useCallback(
        (studentId: number): string => {
            let total = 0;
            for (const comp of components) {
                const val = grades[`${studentId}-${comp.id}`];
                if (val != null && comp.max_score > 0) {
                    total += (val / comp.max_score) * comp.weight;
                }
            }
            return totalWeight > 0
                ? `${((total / totalWeight) * 100).toFixed(1)}%`
                : '-';
        },
        [components, grades, totalWeight],
    );

    const handleSaveAll = useCallback(() => {
        router.post(
            `/gradebook/${gradebook_id}/grades`,
            { grades },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setDirty(false),
            },
        );
    }, [grades, gradebook_id]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">
                    {students.length} students &middot; {components.length}{' '}
                    components
                </h3>
                <Button onClick={handleSaveAll} disabled={!dirty}>
                    <Save className="size-4" />
                    Save All
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="sticky left-0 z-10 bg-muted/50 px-3 py-2 text-left font-medium">
                                Student
                            </th>
                            <th className="sticky left-[180px] z-10 bg-muted/50 px-3 py-2 text-left font-medium">
                                Reg. No.
                            </th>
                            {components.map((comp) => (
                                <th
                                    key={comp.id}
                                    className="min-w-[100px] px-2 py-2 text-center font-medium"
                                    title={`Max: ${comp.max_score}, Weight: ${comp.weight}%`}
                                >
                                    <div className="text-xs">{comp.name}</div>
                                    <div className="text-[10px] text-muted-foreground">
                                        /{comp.max_score} ({comp.weight}%)
                                    </div>
                                </th>
                            ))}
                            <th className="min-w-[80px] bg-muted/50 px-2 py-2 text-center font-medium">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr
                                key={student.student_id}
                                className="border-b last:border-b-0 hover:bg-muted/20"
                            >
                                <td className="sticky left-0 z-10 bg-card px-3 py-2 font-medium">
                                    {student.student_name}
                                </td>
                                <td className="sticky left-[180px] z-10 bg-card px-3 py-2 text-muted-foreground">
                                    {student.registration_number}
                                </td>
                                {components.map((comp) => {
                                    const key = `${student.student_id}-${comp.id}`;
                                    const val = grades[key];
                                    return (
                                        <td key={key} className="px-2 py-1">
                                            <input
                                                type="number"
                                                min={0}
                                                max={comp.max_score}
                                                step="0.5"
                                                value={val ?? ''}
                                                onChange={(e) =>
                                                    updateGrade(
                                                        student.student_id,
                                                        comp.id,
                                                        e.target.value,
                                                    )
                                                }
                                                className={cn(
                                                    'h-8 w-full rounded border bg-transparent px-2 text-center text-sm transition-colors outline-none focus:border-ring focus:ring-1 focus:ring-ring',
                                                    val != null &&
                                                        val > comp.max_score
                                                        ? 'border-red-400 text-red-600'
                                                        : 'border-input',
                                                )}
                                            />
                                        </td>
                                    );
                                })}
                                <td className="bg-muted/20 px-2 py-2 text-center font-semibold">
                                    {calcWeightedTotal(student.student_id)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
