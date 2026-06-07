import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    ChevronDown,
    ChevronUp,
    FileVideo,
    FileText,
    Link,
    HelpCircle,
    FileCheck,
    Award,
    Clock,
} from 'lucide-react';

interface Resource {
    id: number;
    title: string;
    type: 'video' | 'document' | 'link' | 'quiz';
    url: string;
}

interface Module {
    id: number;
    title: string;
    description: string;
    resources: Resource[];
}

interface Submission {
    id: number;
    student_name: string;
    assignment_title: string;
    score: number | null;
    max_score: number;
    submitted_at: string;
}

interface CourseViewerProps {
    modules: Module[];
    recent_submissions: Submission[];
}

const resourceIcon = {
    video: FileVideo,
    document: FileText,
    link: Link,
    quiz: HelpCircle,
};

export function CourseViewer({
    modules,
    recent_submissions,
}: CourseViewerProps) {
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const toggleModule = (id: number) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
                <h2 className="text-lg font-semibold">Course Content</h2>
                {modules.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No modules available.
                    </p>
                )}
                {modules.map((mod) => {
                    const open = expanded[mod.id];
                    return (
                        <div
                            key={mod.id}
                            className="overflow-hidden rounded-lg border bg-card shadow-sm"
                        >
                            <button
                                onClick={() => toggleModule(mod.id)}
                                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30"
                            >
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        {mod.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {mod.description}
                                    </p>
                                </div>
                                {open ? (
                                    <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                                )}
                            </button>
                            {open && (
                                <div className="border-t px-4 py-2">
                                    {mod.resources.length === 0 && (
                                        <p className="py-2 text-xs text-muted-foreground">
                                            No resources in this module.
                                        </p>
                                    )}
                                    {mod.resources.map((res) => {
                                        const Icon = resourceIcon[res.type];
                                        return (
                                            <a
                                                key={res.id}
                                                href={res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted/50"
                                            >
                                                <Icon className="size-4 shrink-0 text-muted-foreground" />
                                                <span className="flex-1">
                                                    {res.title}
                                                </span>
                                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground capitalize">
                                                    {res.type}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold">
                    Recent Submissions
                </h3>
                {recent_submissions.length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                        No submissions yet.
                    </p>
                )}
                <div className="space-y-3">
                    {recent_submissions.map((sub) => (
                        <div
                            key={sub.id}
                            className="border-b pb-2 last:border-b-0 last:pb-0"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {sub.student_name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {sub.assignment_title}
                                    </p>
                                </div>
                                {sub.score != null ? (
                                    <div className="flex items-center gap-1 text-xs">
                                        <Award
                                            className={cn(
                                                'size-3.5',
                                                sub.score >= sub.max_score * 0.8
                                                    ? 'text-green-600'
                                                    : sub.score >=
                                                        sub.max_score * 0.5
                                                      ? 'text-yellow-600'
                                                      : 'text-red-600',
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                'font-semibold',
                                                sub.score >= sub.max_score * 0.8
                                                    ? 'text-green-600'
                                                    : sub.score >=
                                                        sub.max_score * 0.5
                                                      ? 'text-yellow-600'
                                                      : 'text-red-600',
                                            )}
                                        >
                                            {sub.score}/{sub.max_score}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground">
                                        Ungraded
                                    </span>
                                )}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Clock className="size-3" />
                                {sub.submitted_at}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
