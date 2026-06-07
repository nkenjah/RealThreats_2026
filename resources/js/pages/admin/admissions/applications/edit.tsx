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
import type { Application, Prospect, Program, User } from '@/types';

interface Props {
    application: Application;
    prospects: Prospect[];
    programs: Program[];
    reviewers: User[];
}

export default function ApplicationsEdit({
    application,
    prospects,
    programs,
    reviewers,
}: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        prospect_id: String(application.prospect_id ?? ''),
        program_id: String(application.program_id ?? ''),
        submission_date: application.submission_date ?? '',
        status: application.status,
        assigned_reviewer_id: String(application.assigned_reviewer_id ?? ''),
        review_notes: application.review_notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/admissions/applications/${application.id}`);
    };

    return (
        <>
            <Head title={`Edit Application #${application.id}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/admissions/applications">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">
                        Edit Application #{application.id}
                    </h1>
                </div>

                <div className="max-w-lg rounded-lg border bg-card p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="prospect_id">Prospect</Label>
                            <Select
                                value={data.prospect_id}
                                onValueChange={(v) => setData('prospect_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select prospect" />
                                </SelectTrigger>
                                <SelectContent>
                                    {prospects.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={String(p.id)}
                                        >
                                            {p.first_name} {p.last_name} -{' '}
                                            {p.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.prospect_id && (
                                <p className="text-sm text-destructive">
                                    {errors.prospect_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="program_id">Program</Label>
                            <Select
                                value={data.program_id}
                                onValueChange={(v) => setData('program_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={String(p.id)}
                                        >
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.program_id && (
                                <p className="text-sm text-destructive">
                                    {errors.program_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="submission_date">
                                Submission Date
                            </Label>
                            <Input
                                id="submission_date"
                                type="date"
                                value={data.submission_date}
                                onChange={(e) =>
                                    setData('submission_date', e.target.value)
                                }
                            />
                            {errors.submission_date && (
                                <p className="text-sm text-destructive">
                                    {errors.submission_date}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="submitted">
                                        Submitted
                                    </SelectItem>
                                    <SelectItem value="under_review">
                                        Under Review
                                    </SelectItem>
                                    <SelectItem value="accepted">
                                        Accepted
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                    <SelectItem value="waitlisted">
                                        Waitlisted
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="assigned_reviewer_id">
                                Assigned Reviewer
                            </Label>
                            <Select
                                value={data.assigned_reviewer_id}
                                onValueChange={(v) =>
                                    setData('assigned_reviewer_id', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select reviewer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Unassigned</SelectItem>
                                    {reviewers.map((r) => (
                                        <SelectItem
                                            key={r.id}
                                            value={String(r.id)}
                                        >
                                            {r.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.assigned_reviewer_id && (
                                <p className="text-sm text-destructive">
                                    {errors.assigned_reviewer_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="review_notes">Review Notes</Label>
                            <textarea
                                id="review_notes"
                                value={data.review_notes}
                                onChange={(e) =>
                                    setData('review_notes', e.target.value)
                                }
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                rows={4}
                            />
                            {errors.review_notes && (
                                <p className="text-sm text-destructive">
                                    {errors.review_notes}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Updating...'
                                    : 'Update Application'}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/admin/admissions/applications">
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

ApplicationsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admissions', href: '/admin/admissions' },
        { title: 'Applications', href: '/admin/admissions/applications' },
        { title: 'Edit', href: '' },
    ],
};
