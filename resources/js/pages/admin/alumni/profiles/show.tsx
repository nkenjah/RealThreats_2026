import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface Donation {
    id: number;
    amount: number;
    date: string;
    fund: string;
}

interface CareerPlacement {
    id: number;
    company: string;
    job_title: string;
    start_date: string;
    end_date: string | null;
}

interface Alumni {
    id: number;
    student_id: number;
    graduation_year: number;
    company: string | null;
    job_title: string | null;
    industry: string | null;
    phone: string | null;
    address: string | null;
    bio: string | null;
    student?: { id: number; name: string; registration_number: string };
    donations?: Donation[];
    career_placements?: CareerPlacement[];
}

interface Props {
    alumniProfile: Alumni;
}

export default function AlumniShow({ alumniProfile }: Props) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Head title={`Alumni: ${alumniProfile.student?.name ?? 'N/A'}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/alumni">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {alumniProfile.student?.name ?? 'N/A'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Class of {alumniProfile.graduation_year}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={`/admin/alumni/${alumniProfile.id}/edit`}
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
                            Profile Details
                        </h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Student
                                </dt>
                                <dd>{alumniProfile.student?.name ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Graduation Year
                                </dt>
                                <dd>{alumniProfile.graduation_year}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Company
                                </dt>
                                <dd>{alumniProfile.company ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Job Title
                                </dt>
                                <dd>{alumniProfile.job_title ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Industry
                                </dt>
                                <dd>{alumniProfile.industry ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Phone</dt>
                                <dd>{alumniProfile.phone ?? 'N/A'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Address
                                </dt>
                                <dd>{alumniProfile.address ?? 'N/A'}</dd>
                            </div>
                        </dl>
                    </div>

                    {alumniProfile.bio && (
                        <div className="rounded-lg border bg-card p-4">
                            <h2 className="mb-4 text-sm font-medium">Bio</h2>
                            <p className="text-sm">{alumniProfile.bio}</p>
                        </div>
                    )}
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">Donations</h2>
                    {alumniProfile.donations &&
                    alumniProfile.donations.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Fund
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Amount
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumniProfile.donations.map((d) => (
                                    <tr
                                        key={d.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-3 py-2">{d.fund}</td>
                                        <td className="px-3 py-2">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'TZS',
                                            }).format(d.amount)}
                                        </td>
                                        <td className="px-3 py-2">
                                            {new Date(
                                                d.date,
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No donations recorded.
                        </p>
                    )}
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-4 text-sm font-medium">
                        Career Placements
                    </h2>
                    {alumniProfile.career_placements &&
                    alumniProfile.career_placements.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Company
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Job Title
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        Start
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                        End
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumniProfile.career_placements.map((cp) => (
                                    <tr
                                        key={cp.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-3 py-2">
                                            {cp.company}
                                        </td>
                                        <td className="px-3 py-2">
                                            {cp.job_title}
                                        </td>
                                        <td className="px-3 py-2">
                                            {new Date(
                                                cp.start_date,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 py-2">
                                            {cp.end_date
                                                ? new Date(
                                                      cp.end_date,
                                                  ).toLocaleDateString()
                                                : 'Current'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No career placements recorded.
                        </p>
                    )}
                </div>
            </div>

            <ConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={() => {
                    router.delete(`/admin/alumni/${alumniProfile.id}`);
                    setShowDelete(false);
                }}
                title="Delete Alumni?"
                description="This will permanently delete this alumni record."
                confirmText="Delete"
                variant="destructive"
            />
        </>
    );
}

AlumniShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Alumni', href: '/admin/alumni' },
        { title: 'Alumni Details', href: '' },
    ],
};
