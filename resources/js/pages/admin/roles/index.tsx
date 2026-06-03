import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useState } from 'react';

interface RoleData {
    id: number;
    name: string;
    guard_name: string;
    permissions: string[];
}

interface Props {
    roles: RoleData[];
    permissions: string[];
}

export default function RolesIndex({ roles, permissions }: Props) {
    const [rolePermissions, setRolePermissions] = useState<
        Record<string, string[]>
    >(Object.fromEntries(roles.map((r) => [r.name, [...r.permissions]])));
    const [saving, setSaving] = useState<string | null>(null);

    const togglePermission = (roleName: string, permission: string) => {
        setRolePermissions((prev) => {
            const current = prev[roleName] ?? [];
            const updated = current.includes(permission)
                ? current.filter((p) => p !== permission)
                : [...current, permission];
            return { ...prev, [roleName]: updated };
        });
    };

    const toggleAll = (roleName: string, checked: boolean) => {
        setRolePermissions((prev) => ({
            ...prev,
            [roleName]: checked ? [...permissions] : [],
        }));
    };

    const saveRole = (role: RoleData) => {
        setSaving(role.name);
        router.patch(
            `/admin/roles/${role.id}`,
            { permissions: rolePermissions[role.name] ?? [] },
            {
                preserveScroll: true,
                onFinish: () => setSaving(null),
            },
        );
    };

    return (
        <>
            <Head title="Role Permissions" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Shield className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Role Permissions</h1>
                </div>

                <p className="text-sm text-muted-foreground">
                    Assign permissions to each role. Changes take effect
                    immediately.
                </p>

                <div className="space-y-6">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="rounded-lg border bg-card"
                        >
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-sm font-medium capitalize">
                                        {role.name}
                                    </h2>
                                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                        {rolePermissions[role.name]?.length ??
                                            0}{' '}
                                        / {permissions.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Checkbox
                                            checked={
                                                (rolePermissions[role.name]
                                                    ?.length ?? 0) ===
                                                permissions.length
                                            }
                                            onCheckedChange={(checked) =>
                                                toggleAll(
                                                    role.name,
                                                    checked as boolean,
                                                )
                                            }
                                        />
                                        Select All
                                    </label>
                                    <Button
                                        size="sm"
                                        onClick={() => saveRole(role)}
                                        disabled={saving === role.name}
                                    >
                                        {saving === role.name
                                            ? 'Saving...'
                                            : 'Save'}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                {permissions.map((permission) => {
                                    const checked =
                                        rolePermissions[role.name]?.includes(
                                            permission,
                                        ) ?? false;
                                    return (
                                        <label
                                            key={permission}
                                            className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                                                checked
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-input hover:bg-muted/50'
                                            }`}
                                        >
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={() =>
                                                    togglePermission(
                                                        role.name,
                                                        permission,
                                                    )
                                                }
                                            />
                                            <span className="capitalize">
                                                {permission.replace(/_/g, ' ')}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Role Permissions', href: '/admin/roles' },
    ],
};
