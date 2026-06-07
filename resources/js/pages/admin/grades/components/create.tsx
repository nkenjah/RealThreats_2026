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
    course?: { id: number; name: string; code: string };
}

interface Props {
    courseOfferings: CourseOffering[];
}

export default function ComponentsCreate({ courseOfferings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        course_offering_id: '',
        name: '',
        type: '',
        max_score: '',
        weight: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/gradebook-components');
    };

    return (
        <>
            <Head title="Create Component" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/gradebook-components">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">
                        Create Gradebook Component
                    </h1>
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
                                            {co.course?.code} -{' '}
                                            {co.course?.name}
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
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g. Midterm Exam"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(v) => setData('type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="exam">Exam</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="assignment">
                                        Assignment
                                    </SelectItem>
                                    <SelectItem value="project">
                                        Project
                                    </SelectItem>
                                    <SelectItem value="participation">
                                        Participation
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-destructive">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="max_score">Max Score</Label>
                            <Input
                                id="max_score"
                                type="number"
                                step="0.01"
                                value={data.max_score}
                                onChange={(e) =>
                                    setData('max_score', e.target.value)
                                }
                                placeholder="e.g. 100"
                            />
                            {errors.max_score && (
                                <p className="text-sm text-destructive">
                                    {errors.max_score}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="weight">Weight (%)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.01"
                                value={data.weight}
                                onChange={(e) =>
                                    setData('weight', e.target.value)
                                }
                                placeholder="e.g. 20"
                            />
                            {errors.weight && (
                                <p className="text-sm text-destructive">
                                    {errors.weight}
                                </p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Component'}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

ComponentsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gradebook Components', href: '/admin/gradebook-components' },
        { title: 'Create', href: '' },
    ],
};
