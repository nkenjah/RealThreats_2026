import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserRiskBadge from '@/components/users/UserRiskBadge';
import type { User, Department, Role } from '@/types';
import DataTable from '@/components/shared/DataTable';

interface Props {
    users: any;
    filters: Record<string, string | undefined>;
    departments: Department[];
    roles: Role[];
}

export default function UsersIndex({
    users,
    filters,
    departments,
    roles,
}: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (user: User) => (
                <Link
                    href={`/admin/users/${user.id}`}
                    className="font-medium hover:underline"
                >
                    {user.name}
                </Link>
            ),
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'department',
            label: 'Department',
            render: (user: User) =>
                user.department?.name ?? (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'roles',
            label: 'Role',
            render: (user: User) => (
                <span className="capitalize">
                    {user.roles?.[0]?.name ?? 'N/A'}
                </span>
            ),
        },
        {
            key: 'risk_score',
            label: 'Risk Score',
            render: (user: User) =>
                user.risk_score ? (
                    <UserRiskBadge score={user.risk_score.current_score} />
                ) : (
                    <span className="text-muted-foreground">N/A</span>
                ),
        },
        {
            key: 'is_locked',
            label: 'Status',
            render: (user: User) =>
                user.is_locked ? (
                    <span className="font-medium text-destructive">Locked</span>
                ) : (
                    <span className="text-green-500">Active</span>
                ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (user: User) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/users/${user.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/users/${user.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            ),
        },
    ];

    const filterFields = (
        <>
            <select
                name="role"
                defaultValue={filters.role ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value)
                        url.searchParams.set('role', e.target.value);
                    else url.searchParams.delete('role');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Roles</option>
                {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                        {r.name}
                    </option>
                ))}
            </select>
            <select
                name="department_id"
                defaultValue={filters.department_id ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value)
                        url.searchParams.set('department_id', e.target.value);
                    else url.searchParams.delete('department_id');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Departments</option>
                {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                ))}
            </select>
            <select
                name="locked"
                defaultValue={filters.locked ?? ''}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                onChange={(e) => {
                    const url = new URL(window.location.href);
                    if (e.target.value !== '')
                        url.searchParams.set('locked', e.target.value);
                    else url.searchParams.delete('locked');
                    url.searchParams.set('page', '1');
                    window.location.href = url.toString();
                }}
            >
                <option value="">All Status</option>
                <option value="1">Locked</option>
                <option value="0">Active</option>
            </select>
        </>
    );

    return (
        <>
            <Head title="User Management" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <Button asChild>
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4" /> Create User
                        </Link>
                    </Button>
                </div>

                <DataTable
                    data={users}
                    columns={columns}
                    filters={filters}
                    searchPlaceholder="Search by name or email..."
                    filterFields={filterFields}
                />
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
    ],
};
