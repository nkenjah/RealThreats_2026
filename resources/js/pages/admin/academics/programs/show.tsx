import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Program {
    id: number;
    name: string;
    code: string;
    description: string | null;
    duration_years: number;
    total_credits: number;
    program_requirements?: {
        id: number;
        name: string;
        type: string;
        credits_required: number;
    }[];
}

interface Props {
    program: Program;
}

export default function ProgramsShow({ program }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Program: ${program.name}`} />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/programs">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{program.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {program.code}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/programs/${program.id}/edit`}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDelete(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h2 className="mb-4 text-sm font-medium">
                            Program Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Name</dt>
                                <dd>{program.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Code</dt>
                                <dd className="font-mono">{program.code}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Duration
                                </dt>
                                <dd>{program.duration_years} years</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Total Credits
                                </dt>
                                <dd>{program.total_credits}</dd>
                            </div>
                            {program.description && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Description
                                    </dt>
                                    <dd className="max-w-xs text-right">
                                        {program.description}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">
                        Program Requirements
                    </h2>
                    {program.program_requirements &&
                    program.program_requirements.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Type
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Credits Required
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {program.program_requirements.map((req) => (
                                    <tr
                                        key={req.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-3 py-2">
                                            {req.name}
                                        </td>
                                        <td className="px-3 py-2 capitalize">
                                            {req.type}
                                        </td>
                                        <td className="px-3 py-2">
                                            {req.credits_required}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No requirements defined.
                        </p>
                    )}
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/programs/${program.id}`);
                    setShowDelete(false);
                }}
                title="Delete Program?"
                description="This will permanently delete this program."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

ProgramsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Programs', href: '/admin/programs' },
        { title: 'Program Details', href: '' },
    ],
};
