import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    QrCode,
    ClipboardList,
    CalendarCheck,
    Lock,
    Unlock,
} from 'lucide-react';

interface ExamItem {
    id: number;
    course: string;
    code: string;
    starts_at: string;
    venue: string;
    is_locked: boolean;
}

interface Props {
    exams: ExamItem[];
}

export default function ExamAttendanceIndex({ exams }: Props) {
    const todayExams = exams.filter((e) => e.starts_at !== 'TBD');
    const otherExams = exams.filter((e) => e.starts_at === 'TBD');

    return (
        <>
            <Head title="Exam Attendance" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Exam Attendance</h1>
                        <p className="text-sm text-muted-foreground">
                            Scan student QR codes to record exam attendance
                        </p>
                    </div>
                </div>

                {todayExams.length > 0 && (
                    <>
                        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                            Today's Exams
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {todayExams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="rounded-lg border bg-card p-4"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {exam.code}
                                            </p>
                                            <p className="text-sm font-medium">
                                                {exam.course}
                                            </p>
                                        </div>
                                        {exam.is_locked ? (
                                            <Lock className="size-4 text-muted-foreground" />
                                        ) : (
                                            <Unlock className="size-4 text-green-500" />
                                        )}
                                    </div>
                                    <div className="mb-4 space-y-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <CalendarCheck className="size-3" />
                                            {exam.starts_at}
                                        </div>
                                        <div>Venue: {exam.venue}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/exam-attendance/${exam.id}/scanner`}
                                            >
                                                <QrCode className="mr-2 h-4 w-4" />
                                                Scan
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/exam-attendance/${exam.id}/list`}
                                            >
                                                <ClipboardList className="mr-2 h-4 w-4" />
                                                List
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {otherExams.length > 0 && (
                    <>
                        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                            All Exams
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {otherExams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="rounded-lg border bg-card p-4 opacity-70"
                                >
                                    <div className="mb-3">
                                        <p className="text-xs text-muted-foreground">
                                            {exam.code}
                                        </p>
                                        <p className="text-sm font-medium">
                                            {exam.course}
                                        </p>
                                    </div>
                                    <div className="mb-4 space-y-1 text-xs text-muted-foreground">
                                        <div>Venue: {exam.venue}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/exam-attendance/${exam.id}/scanner`}
                                            >
                                                <QrCode className="mr-2 h-4 w-4" />
                                                Scan
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/exam-attendance/${exam.id}/list`}
                                            >
                                                <ClipboardList className="mr-2 h-4 w-4" />
                                                List
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {exams.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-20 text-center">
                        <QrCode className="h-12 w-12 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                            No exams found.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

ExamAttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exam Attendance', href: '' },
    ],
};
