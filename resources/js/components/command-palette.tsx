import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Activity,
    Award,
    Banknote,
    BarChart3,
    Bed,
    Bell,
    BookMarked,
    BookOpen,
    BookPlus,
    Briefcase,
    Building,
    Building2,
    CalendarCheck,
    ClipboardCheck,
    ClipboardList,
    Clock,
    Command,
    CreditCard,
    DollarSign,
    DoorOpen,
    Download,
    FileCheck,
    FileOutput,
    FileSpreadsheet,
    FileText,
    Gift,
    GraduationCap,
    Handshake,
    HeartHandshake,
    History,
    Home,
    Landmark,
    LayoutGrid,
    Library,
    ListChecks,
    Monitor,
    Package,
    PiggyBank,
    Receipt,
    Scroll,
    ScrollText,
    Search,
    SearchCheck,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Sigma,
    type LucideIcon,
    University,
    UserCheck,
    UserCog,
    UserPlus,
    Users,
    UsersRound,
    Wallet,
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
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                id: 'notifications',
                label: 'Notifications',
                href: '/notifications',
                icon: Bell,
            },
        ],
    },
    {
        group: 'Academic',
        items: [
            {
                id: 'courses',
                label: 'Courses',
                href: '/admin/courses',
                icon: BookMarked,
            },
            {
                id: 'lectures',
                label: 'Lectures',
                href: '/admin/lectures',
                icon: GraduationCap,
            },
            {
                id: 'students',
                label: 'Students',
                href: '/admin/students',
                icon: Users,
            },
            {
                id: 'programs',
                label: 'Programs',
                href: '/admin/programs',
                icon: Scroll,
            },
            {
                id: 'offerings',
                label: 'Course Offerings',
                href: '/admin/offerings',
                icon: BookOpen,
            },
            {
                id: 'enrollments',
                label: 'Enrollments',
                href: '/admin/enrollments',
                icon: UserCheck,
            },
            {
                id: 'timetables',
                label: 'Timetables',
                href: '/admin/timetables',
                icon: Clock,
            },
            {
                id: 'faculty',
                label: 'Faculty',
                href: '/admin/faculty',
                icon: UserCog,
            },
            {
                id: 'attendance',
                label: 'Attendance',
                href: '/admin/attendance',
                icon: ClipboardCheck,
            },
        ],
    },
    {
        group: 'Exams & Results',
        items: [
            {
                id: 'exams',
                label: 'Exam Schedule',
                href: '/admin/exams',
                icon: CalendarCheck,
            },
            {
                id: 'grades',
                label: 'Grade Entry',
                href: '/admin/grades',
                icon: Sigma,
            },
            {
                id: 'final-results',
                label: 'Final Results',
                href: '/admin/final-term-grades',
                icon: Award,
            },
            {
                id: 'gradebook',
                label: 'Assessment Structure',
                href: '/admin/gradebook-components',
                icon: ScrollText,
            },
            {
                id: 'exam-cards',
                label: 'Exam Cards',
                href: '/admin/exam-cards',
                icon: ClipboardList,
            },
            {
                id: 'exam-attendance',
                label: 'Exam Attendance',
                href: '/admin/exam-attendance',
                icon: SearchCheck,
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
                icon: UserPlus,
            },
            {
                id: 'applications',
                label: 'Applications',
                href: '/admin/admissions/applications',
                icon: FileText,
            },
            {
                id: 'offers',
                label: 'Offers',
                href: '/admin/admissions/offers',
                icon: Handshake,
            },
            {
                id: 'app-requirements',
                label: 'Requirements',
                href: '/admin/admissions/application-requirements',
                icon: ListChecks,
            },
        ],
    },
    {
        group: 'Finance',
        items: [
            {
                id: 'fees',
                label: 'Fees',
                href: '/admin/fees',
                icon: DollarSign,
            },
            {
                id: 'financial-accounts',
                label: 'Financial Accounts',
                href: '/admin/financial-accounts',
                icon: Wallet,
            },
            {
                id: 'payments',
                label: 'Payments',
                href: '/admin/payments',
                icon: Banknote,
            },
            {
                id: 'scholarships',
                label: 'Scholarships',
                href: '/admin/scholarship-awards',
                icon: Gift,
            },
            {
                id: 'fund-sources',
                label: 'Fund Sources',
                href: '/admin/fund-sources',
                icon: PiggyBank,
            },
            {
                id: 'heslb',
                label: 'HESLB Allocations',
                href: '/admin/heslb-allocations',
                icon: University,
            },
        ],
    },
    {
        group: 'Graduation',
        items: [
            {
                id: 'grad-applications',
                label: 'Grad Applications',
                href: '/admin/academics/graduation-applications',
                icon: FileCheck,
            },
            {
                id: 'grad-clearance',
                label: 'Clearance',
                href: '/admin/graduation-clearance',
                icon: ShieldCheck,
            },
            {
                id: 'transcripts',
                label: 'Transcripts',
                href: '/admin/academics/transcripts',
                icon: FileOutput,
            },
            {
                id: 'degree-audits',
                label: 'Degree Audits',
                href: '/admin/academics/degree-audits',
                icon: SearchCheck,
            },
            {
                id: 'result-slips',
                label: 'Result Slips',
                href: '/admin/result-slips',
                icon: Download,
            },
        ],
    },
    {
        group: 'Library',
        items: [
            {
                id: 'library-items',
                label: 'Books',
                href: '/admin/library',
                icon: BookPlus,
            },
            {
                id: 'library-fines',
                label: 'Fines',
                href: '/admin/library-fines',
                icon: Receipt,
            },
        ],
    },
    {
        group: 'Housing',
        items: [
            {
                id: 'dormitories',
                label: 'Dormitories',
                href: '/admin/dormitories',
                icon: Home,
            },
            {
                id: 'hostels',
                label: 'Hostels',
                href: '/admin/hostels',
                icon: Bed,
            },
        ],
    },
    {
        group: 'Facilities',
        items: [
            {
                id: 'campuses',
                label: 'Campuses',
                href: '/admin/campuses',
                icon: Building2,
            },
            {
                id: 'buildings',
                label: 'Buildings',
                href: '/admin/buildings',
                icon: Building,
            },
            {
                id: 'rooms',
                label: 'Rooms',
                href: '/admin/rooms',
                icon: DoorOpen,
            },
            {
                id: 'room-inventory',
                label: 'Room Inventory',
                href: '/admin/room-inventory',
                icon: Package,
            },
        ],
    },
    {
        group: 'Alumni & LMS',
        items: [
            {
                id: 'alumni-profiles',
                label: 'Alumni Profiles',
                href: '/admin/alumni',
                icon: UsersRound,
            },
            {
                id: 'career-placements',
                label: 'Career Placements',
                href: '/admin/career-placements',
                icon: Briefcase,
            },
            {
                id: 'donations',
                label: 'Donations',
                href: '/admin/donations',
                icon: HeartHandshake,
            },
            {
                id: 'lms-courses',
                label: 'LMS Courses',
                href: '/admin/lms-courses',
                icon: Monitor,
            },
        ],
    },
    {
        group: 'System',
        items: [
            {
                id: 'system-users',
                label: 'Users',
                href: '/admin/users',
                icon: UserCog,
            },
            {
                id: 'semester',
                label: 'Semester',
                href: '/admin/semester',
                icon: CalendarCheck,
            },
            {
                id: 'threat-alerts',
                label: 'Threat Alerts',
                href: '/admin/threat-alerts',
                icon: ShieldAlert,
            },
            {
                id: 'activity-logs',
                label: 'Activity Logs',
                href: '/admin/activity-logs',
                icon: Activity,
            },
            {
                id: 'reports',
                label: 'Reports',
                href: '/admin/reports',
                icon: BarChart3,
            },
            {
                id: 'roles',
                label: 'Roles',
                href: '/admin/roles',
                icon: ShieldCheck,
            },
            {
                id: 'system-config',
                label: 'System Config',
                href: '/admin/system-config',
                icon: Settings,
            },
            {
                id: 'session-logs',
                label: 'Session Logs',
                href: '/admin/session-logs',
                icon: History,
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
