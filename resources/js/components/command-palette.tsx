import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    LayoutGrid,
    PenLine,
    FileText,
    BookMarked,
    GraduationCap,
    ClipboardList,
    Library,
    UserCheck,
    Calendar,
    Users,
    Award,
    ScrollText,
    CreditCard,
    Landmark,
    Building2,
    Home,
    Briefcase,
    Handshake,
    ShieldAlert,
    Activity,
    ShieldCheck,
    Settings,
    Monitor,
    type LucideIcon,
    Search,
    Command,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface CommandItem {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
}

interface CommandGroup {
    group: string;
    items: CommandItem[];
}

const commandGroups: CommandGroup[] = [
    {
        group: 'Dashboard',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutGrid,
            },
        ],
    },
    {
        group: 'Admissions',
        items: [
            {
                id: 'prospects',
                label: 'Prospects',
                href: '/admin/admissions/prospects',
                icon: PenLine,
            },
            {
                id: 'applications',
                label: 'Applications',
                href: '/admin/admissions/applications',
                icon: FileText,
            },
        ],
    },
    {
        group: 'Academic',
        items: [
            {
                id: 'courses',
                label: 'Courses',
                href: '/admin/academic/courses',
                icon: BookMarked,
            },
            {
                id: 'lectures',
                label: 'Lectures',
                href: '/admin/academic/lectures',
                icon: GraduationCap,
            },
            {
                id: 'exams',
                label: 'Exams',
                href: '/admin/academic/exams',
                icon: ClipboardList,
            },
            {
                id: 'students',
                label: 'Students',
                href: '/admin/academic/students',
                icon: Library,
            },
            {
                id: 'programs',
                label: 'Programs',
                href: '/admin/academic/programs',
                icon: GraduationCap,
            },
            {
                id: 'offerings',
                label: 'Offerings',
                href: '/admin/academic/offerings',
                icon: BookMarked,
            },
            {
                id: 'enrollments',
                label: 'Enrollments',
                href: '/admin/academic/enrollments',
                icon: UserCheck,
            },
            {
                id: 'timetables',
                label: 'Timetables',
                href: '/admin/academic/timetables',
                icon: Calendar,
            },
            {
                id: 'faculty',
                label: 'Faculty',
                href: '/admin/academic/faculty',
                icon: Users,
            },
            {
                id: 'grades',
                label: 'Grades',
                href: '/admin/academic/grades',
                icon: Award,
            },
            {
                id: 'gradebook',
                label: 'Gradebook Components',
                href: '/admin/academic/gradebook',
                icon: ScrollText,
            },
            {
                id: 'final-term-grades',
                label: 'Final Term Grades',
                href: '/admin/academic/final-term-grades',
                icon: Award,
            },
            {
                id: 'attendance',
                label: 'Attendance',
                href: '/admin/academic/attendance',
                icon: PenLine,
            },
        ],
    },
    {
        group: 'Curriculum',
        items: [
            {
                id: 'program-requirements',
                label: 'Program Requirements',
                href: '/admin/curriculum/program-requirements',
                icon: ScrollText,
            },
            {
                id: 'course-prerequisites',
                label: 'Course Prerequisites',
                href: '/admin/curriculum/course-prerequisites',
                icon: BookMarked,
            },
        ],
    },
    {
        group: 'Academic Records',
        items: [
            {
                id: 'transcripts',
                label: 'Transcripts',
                href: '/admin/academic-records/transcripts',
                icon: FileText,
            },
            {
                id: 'degree-audits',
                label: 'Degree Audits',
                href: '/admin/academic-records/degree-audits',
                icon: FileText,
            },
        ],
    },
    {
        group: 'Finance',
        items: [
            {
                id: 'fees',
                label: 'Fees',
                href: '/admin/finance/fees',
                icon: CreditCard,
            },
            {
                id: 'financial-accounts',
                label: 'Financial Accounts',
                href: '/admin/finance/accounts',
                icon: Landmark,
            },
            {
                id: 'payments',
                label: 'Payments',
                href: '/admin/finance/payments',
                icon: CreditCard,
            },
            {
                id: 'scholarships',
                label: 'Scholarships',
                href: '/admin/finance/scholarships',
                icon: Award,
            },
            {
                id: 'fund-sources',
                label: 'Fund Sources',
                href: '/admin/finance/fund-sources',
                icon: Landmark,
            },
        ],
    },
    {
        group: 'Facilities',
        items: [
            {
                id: 'campuses',
                label: 'Campuses',
                href: '/admin/facilities/campuses',
                icon: Building2,
            },
            {
                id: 'buildings',
                label: 'Buildings',
                href: '/admin/facilities/buildings',
                icon: Building2,
            },
            {
                id: 'rooms',
                label: 'Rooms',
                href: '/admin/facilities/rooms',
                icon: Building2,
            },
        ],
    },
    {
        group: 'Library',
        items: [
            {
                id: 'library-items',
                label: 'Library Items',
                href: '/admin/library/items',
                icon: Library,
            },
            {
                id: 'library-fines',
                label: 'Library Fines',
                href: '/admin/library/fines',
                icon: Library,
            },
        ],
    },
    {
        group: 'LMS',
        items: [
            {
                id: 'lms-courses',
                label: 'Courses',
                href: '/admin/lms/courses',
                icon: Monitor,
            },
        ],
    },
    {
        group: 'Housing',
        items: [
            {
                id: 'dormitories',
                label: 'Dormitories',
                href: '/admin/housing/dormitories',
                icon: Home,
            },
            {
                id: 'hostels',
                label: 'Hostels',
                href: '/admin/housing/hostels',
                icon: Home,
            },
        ],
    },
    {
        group: 'Alumni',
        items: [
            {
                id: 'alumni-profiles',
                label: 'Profiles',
                href: '/admin/alumni/profiles',
                icon: Users,
            },
            {
                id: 'career-placements',
                label: 'Career Placements',
                href: '/admin/alumni/career-placements',
                icon: Briefcase,
            },
            {
                id: 'donations',
                label: 'Donations',
                href: '/admin/alumni/donations',
                icon: Handshake,
            },
        ],
    },
    {
        group: 'System',
        items: [
            {
                id: 'system-users',
                label: 'Users',
                href: '/admin/system/users',
                icon: Users,
            },
            {
                id: 'threat-alerts',
                label: 'Threat Alerts',
                href: '/admin/system/threat-alerts',
                icon: ShieldAlert,
            },
            {
                id: 'activity-logs',
                label: 'Activity Logs',
                href: '/admin/system/activity-logs',
                icon: Activity,
            },
            {
                id: 'reports',
                label: 'Reports',
                href: '/admin/system/reports',
                icon: FileText,
            },
            {
                id: 'roles',
                label: 'Roles',
                href: '/admin/system/roles',
                icon: ShieldCheck,
            },
            {
                id: 'system-config',
                label: 'System Config',
                href: '/admin/system/config',
                icon: Settings,
            },
        ],
    },
];

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return commandGroups;
        return commandGroups
            .map((g) => ({
                ...g,
                items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
            }))
            .filter((g) => g.items.length > 0);
    }, [search]);

    const flatItems = useMemo(
        () => filtered.flatMap((g) => g.items),
        [filtered],
    );

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        if (open) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    const navigate = useCallback((href: string) => {
        setOpen(false);
        router.visit(href);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && flatItems[selectedIndex]) {
                e.preventDefault();
                navigate(flatItems[selectedIndex].href);
            }
        },
        [flatItems, selectedIndex, navigate],
    );

    let globalIndex = 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Command Palette</DialogTitle>
                </DialogHeader>
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search modules..."
                        className="w-full rounded-md border bg-background py-2.5 pr-4 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                    />
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No results found.
                        </p>
                    ) : (
                        filtered.map((group) => (
                            <div key={group.group} className="mb-2">
                                <p className="mb-1 px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {group.group}
                                </p>
                                {group.items.map((item) => {
                                    const idx = globalIndex++;
                                    const selected = idx === selectedIndex;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => navigate(item.href)}
                                            onMouseEnter={() =>
                                                setSelectedIndex(idx)
                                            }
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors',
                                                selected
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'text-foreground',
                                            )}
                                        >
                                            <item.icon className="size-4 shrink-0 text-muted-foreground" />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
                <div className="flex items-center gap-4 border-t pt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Command className="size-3" />K{' '}
                        <kbd className="rounded border px-1">⌘K</kbd>
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border px-1">↑↓</kbd> Navigate
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border px-1">↵</kbd> Open
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border px-1">ESC</kbd> Close
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
