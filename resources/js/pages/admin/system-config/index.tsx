import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import type { SystemConfiguration } from '@/types';

interface Props {
    groups: Record<string, SystemConfiguration[]>;
}

export default function SystemConfigIndex({ groups }: Props) {
    const handleUpdate = (config: SystemConfiguration, value: string) => {
        router.patch(
            `/admin/system-config/${config.id}`,
            { config_value: value },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="System Configuration" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Shield className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">System Configuration</h1>
                </div>

                {Object.entries(groups).map(([group, configs]) => (
                    <div key={group} className="rounded-lg border bg-card">
                        <div className="border-b px-4 py-3">
                            <h2 className="text-sm font-medium capitalize">
                                {group}
                            </h2>
                        </div>
                        <div className="divide-y">
                            {configs.map((config) => (
                                <div
                                    key={config.id}
                                    className="flex items-center justify-between px-4 py-3"
                                >
                                    <div className="flex-1">
                                        <Label className="text-sm font-medium">
                                            {config.config_key.replace(
                                                /_/g,
                                                ' ',
                                            )}
                                        </Label>
                                        {config.description && (
                                            <p className="text-xs text-muted-foreground">
                                                {config.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="ml-4 w-48">
                                        <Input
                                            defaultValue={config.config_value}
                                            className="h-8 text-sm"
                                            onBlur={(e) => {
                                                if (
                                                    e.target.value !==
                                                    config.config_value
                                                ) {
                                                    handleUpdate(
                                                        config,
                                                        e.target.value,
                                                    );
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).blur();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

SystemConfigIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'System Config', href: '/admin/system-config' },
    ],
};
