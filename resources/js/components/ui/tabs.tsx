import { cn } from '@/lib/utils';
import { type ReactNode, useState } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
    const [active, setActive] = useState(defaultTab || tabs[0]?.id);

    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActive(tab.id)}
                        className={cn(
                            'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                            active === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            {tabs.find((t) => t.id === active)?.content}
        </div>
    );
}
