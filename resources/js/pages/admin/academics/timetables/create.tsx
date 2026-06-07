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

interface CourseOffering {
    id: number;
    course?: { name: string; code: string };
}

interface Lecturer {
    id: number;
    staff_number: string;
    user?: { name: string };
}

interface Props {
    courseOfferings: CourseOffering[];
    lecturers: Lecturer[];
}

export default function TimetablesCreate({
    courseOfferings,
    lecturers,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        course_offering_id: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        venue: '',
        semester: '1',
        lecturer_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/timetables');
    };

    return (
        <>
            <Head title="Create Timetable" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/timetables">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Create Timetable</h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="course_offering_id">
                                Course Offering
                            </Label>
                            <Select
                                value={data.course_offering_id}
                                onValueChange={(v) =>
                                    setData('course_offering_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select course offering" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseOfferings.map((co) => (
                                        <SelectItem
                                            key={co.id}
                                            value={String(co.id)}
                                        >
                                            {co.course?.name ??
                                                `Offering #${co.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.course_offering_id && (
                                <p className="text-sm text-destructive">
                                    {errors.course_offering_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="day_of_week">Day of Week</Label>
                            <Select
                                value={data.day_of_week}
                                onValueChange={(v) => setData('day_of_week', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        'Monday',
                                        'Tuesday',
                                        'Wednesday',
                                        'Thursday',
                                        'Friday',
                                        'Saturday',
                                    ].map((day) => (
                                        <SelectItem
                                            key={day}
                                            value={day.toLowerCase()}
                                        >
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.day_of_week && (
                                <p className="text-sm text-destructive">
                                    {errors.day_of_week}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="start_time">Start Time</Label>
                            <Input
                                id="start_time"
                                type="time"
                                value={data.start_time}
                                onChange={(e) =>
                                    setData('start_time', e.target.value)
                                }
                            />
                            {errors.start_time && (
                                <p className="text-sm text-destructive">
                                    {errors.start_time}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="end_time">End Time</Label>
                            <Input
                                id="end_time"
                                type="time"
                                value={data.end_time}
                                onChange={(e) =>
                                    setData('end_time', e.target.value)
                                }
                            />
                            {errors.end_time && (
                                <p className="text-sm text-destructive">
                                    {errors.end_time}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                                id="venue"
                                value={data.venue}
                                onChange={(e) =>
                                    setData('venue', e.target.value)
                                }
                                placeholder="e.g. Lecture Hall A"
                            />
                            {errors.venue && (
                                <p className="text-sm text-destructive">
                                    {errors.venue}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select
                                value={data.semester}
                                onValueChange={(v) => setData('semester', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">
                                        Semester 1
                                    </SelectItem>
                                    <SelectItem value="2">
                                        Semester 2
                                    </SelectItem>
                                    <SelectItem value="3">
                                        Semester 3
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.semester && (
                                <p className="text-sm text-destructive">
                                    {errors.semester}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="lecturer_id">Lecturer</Label>
                            <Select
                                value={data.lecturer_id}
                                onValueChange={(v) => setData('lecturer_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lecturer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lecturers.map((l) => (
                                        <SelectItem
                                            key={l.id}
                                            value={String(l.id)}
                                        >
                                            {l.user?.name ?? l.staff_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Timetable'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

TimetablesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Timetables', href: '/admin/timetables' },
        { title: 'Create', href: '' },
    ],
};
