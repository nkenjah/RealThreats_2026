import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCheck, Clock } from 'lucide-react';

interface Attendance {
    id: number;
    student_name: string;
    registration_number: string;
    checked_in_at: string;
    status: string;
}

interface Props {
    exam: {
        id: number;
        course: { name: string; code: string };
        venue: string;
        starts_at: string;
    };
    attendances: Attendance[];
}

export default function ExamAttendanceList({ exam, attendances }: Props) {
    return (
        <>
            <Head title="Attendance List" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/exam-attendance">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {exam.course.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {exam.course.code} &middot; {exam.venue} &middot;{' '}
                            {exam.starts_at}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <UserCheck className="size-4" />
                        <span className="font-medium">
                            {attendances.length}
                        </span>
                        <span className="text-muted-foreground">
                            checked in
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    #
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Student
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Reg No
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Checked In
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendances.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        No attendance records yet.
                                    </td>
                                </tr>
                            ) : (
                                attendances.map((a, i) => (
                                    <tr
                                        key={a.id}
                                        className="border-b transition-colors last:border-0 hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {i + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {a.student_name}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">
                                            {a.registration_number}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Clock className="size-3" />
                                                {a.checked_in_at}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

ExamAttendanceList.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exam Attendance', href: '/admin/exam-attendance' },
        { title: 'Attendance List', href: '' },
    ],
};
