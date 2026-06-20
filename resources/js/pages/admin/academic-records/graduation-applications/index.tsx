import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';

interface Props {
    graduationApplications: any;
    filters: Record<string, string | undefined>;
}

export default function GraduationApplicationsIndex({
    graduationApplications,
    filters,
}: Props) {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (item: any) => (
                <Link
                    href={`/admin/academics/graduation-applications/${item.id}`}
                    className="font-medium hover:underline"
                >
                    #{item.id}
                </Link>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link
                            href={`/admin/academics/graduation-applications/${item.id}`}
                        >
                            View
                        </Link>
                    </Button>
                    {item.edit !== false && (
                        <Button variant="ghost" size="sm" asChild>
                            <Link
                                href={`/admin/academics/graduation-applications/${item.id}/edit`}
                            >
                                Edit
                            </Link>
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Graduation Applications" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Graduation Applications
                    </h1>
                    <Button asChild>
                        <Link href="/admin/academics/graduation-applications/create">
                            <Plus className="mr-2 h-4 w-4" /> Create
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={graduationApplications}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by student..."
                />
            </div>
        </>
    );
}

GraduationApplicationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Academic Records', href: '/admin/academic-records' },
        { title: 'Graduation Applications', href: '' },
    ],
};
