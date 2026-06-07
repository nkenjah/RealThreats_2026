import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface AcademicTranscript {
    id: number;
    total_credits_earned: number;
    cumulative_gpa: number;
    generated_at: string;
    student?: { id: number; name: string };
    program?: { id: number; name: string };
}

interface Props {
    academicTranscript: AcademicTranscript;
}

export default function TranscriptsShow({ academicTranscript }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title="Transcript Details" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/academics/transcripts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Academic Transcript
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {academicTranscript.student?.name ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/academics/transcripts/${academicTranscript.id}/edit`}
                            >
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
                            Transcript Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Student
                                </dt>
                                <dd>
                                    {academicTranscript.student?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Program
                                </dt>
                                <dd>
                                    {academicTranscript.program?.name ?? 'N/A'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Total Credits Earned
                                </dt>
                                <dd>
                                    {academicTranscript.total_credits_earned}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Cumulative GPA
                                </dt>
                                <dd>{academicTranscript.cumulative_gpa}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Generated At
                                </dt>
                                <dd>{academicTranscript.generated_at}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(
                        `/admin/academics/transcripts/${academicTranscript.id}`,
                    );
                    setShowDelete(false);
                }}
                title="Delete Transcript?"
                description="This will permanently delete this academic transcript."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

TranscriptsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transcripts', href: '/admin/academics/transcripts' },
        { title: 'Transcript Details', href: '' },
    ],
};
