import { Link, usePage } from '@inertiajs/react';
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
    ChevronRight,
    ClipboardCheck,
    ClipboardList,
    Clock,
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
    Hotel,
    Landmark,
    LayoutGrid,
    Library,
    ListChecks,
    Monitor,
    Package,
    PiggyBank,
    Plane,
    Receipt,
    Scroll,
    ScrollText,
    SearchCheck,
    Settings,
    ShoppingCart,
    ShieldAlert,
    ShieldCheck,
    Sigma,
    University,
    UserCheck,
    UserCog,
    UserPlus,
    Users,
    UsersRound,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

function IconWrapper({
    icon: Icon,
    className,
}: {
    icon?: NavItem['icon'];
    className?: string;
}) {
    if (!Icon) return null;
    return <Icon className={className} />;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'Notifications', href: '/notifications', icon: Bell },
        ],
    },
    {
        title: 'Academic',
        items: [
            { title: 'Courses', href: '/admin/courses', icon: BookMarked },
            { title: 'Lectures', href: '/admin/lectures', icon: GraduationCap },
            { title: 'Students', href: '/admin/students', icon: Users },
            { title: 'Programs', href: '/admin/programs', icon: Scroll },
            {
                title: 'Course Offerings',
                href: '/admin/offerings',
                icon: BookOpen,
            },
            {
                title: 'Enrollments',
                href: '/admin/enrollments',
                icon: UserCheck,
            },
            { title: 'Timetables', href: '/admin/timetables', icon: Clock },
            { title: 'Faculty', href: '/admin/faculty', icon: UserCog },
            {
                title: 'Attendance',
                href: '/admin/attendance',
                icon: ClipboardCheck,
            },
        ],
    },
    {
        title: 'Exams & Results',
        items: [
            {
                title: 'Exam Schedule',
                href: '/admin/exams',
                icon: CalendarCheck,
            },
            { title: 'Grade Entry', href: '/admin/grades', icon: Sigma },
            {
                title: 'Final Results',
                href: '/admin/final-term-grades',
                icon: Award,
            },
            {
                title: 'Assessment Structure',
                href: '/admin/gradebook-components',
                icon: ScrollText,
            },
            {
                title: 'Exam Cards',
                href: '/admin/exam-cards',
                icon: ClipboardList,
            },
            {
                title: 'Exam Attendance',
                href: '/admin/exam-attendance',
                icon: SearchCheck,
            },
        ],
    },
    {
        title: 'Admissions',
        items: [
            {
                title: 'Prospects',
                href: '/admin/admissions/prospects',
                icon: UserPlus,
            },
            {
                title: 'Applications',
                href: '/admin/admissions/applications',
                icon: FileText,
            },
            {
                title: 'Offers',
                href: '/admin/admissions/offers',
                icon: Handshake,
            },
            {
                title: 'Requirements',
                href: '/admin/admissions/application-requirements',
                icon: ListChecks,
            },
        ],
    },
    {
        title: 'Finance',
        items: [
            { title: 'Fees', href: '/admin/fees', icon: DollarSign },
            {
                title: 'Financial Accounts',
                href: '/admin/financial-accounts',
                icon: Wallet,
            },
            { title: 'Payments', href: '/admin/payments', icon: Banknote },
            {
                title: 'Scholarships',
                href: '/admin/scholarship-awards',
                icon: Gift,
            },
            {
                title: 'Fund Sources',
                href: '/admin/fund-sources',
                icon: PiggyBank,
            },
            {
                title: 'HESLB Allocations',
                href: '/admin/heslb-allocations',
                icon: University,
            },
            {
                title: 'Scratch Cards',
                href: '/admin/scratch-cards',
                icon: Receipt,
            },
            {
                title: 'Wallets',
                href: '/admin/wallets',
                icon: Wallet,
            },
            {
                title: 'Shop Products',
                href: '/admin/shop/products',
                icon: Package,
            },
            {
                title: 'Shop Orders',
                href: '/admin/shop/orders',
                icon: ShoppingCart,
            },
        ],
    },
    {
        title: 'Graduation',
        items: [
            {
                title: 'Grad Applications',
                href: '/admin/academics/graduation-applications',
                icon: FileCheck,
            },
            {
                title: 'Clearance',
                href: '/admin/graduation-clearance',
                icon: ShieldCheck,
            },
            {
                title: 'Transcripts',
                href: '/admin/academics/transcripts',
                icon: FileOutput,
            },
            {
                title: 'Degree Audits',
                href: '/admin/academics/degree-audits',
                icon: SearchCheck,
            },
            {
                title: 'Result Slips',
                href: '/admin/result-slips',
                icon: Download,
            },
        ],
    },
    {
        title: 'Library',
        items: [
            { title: 'Books', href: '/admin/library', icon: BookPlus },
            { title: 'Fines', href: '/admin/library-fines', icon: Receipt },
        ],
    },
    {
        title: 'Housing',
        items: [
            { title: 'Dormitories', href: '/admin/dormitories', icon: Home },
            { title: 'Hostels', href: '/admin/hostels', icon: Bed },
        ],
    },
    {
        title: 'Facilities',
        items: [
            { title: 'Campuses', href: '/admin/campuses', icon: Building2 },
            { title: 'Buildings', href: '/admin/buildings', icon: Building },
            { title: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
            {
                title: 'Room Inventory',
                href: '/admin/room-inventory',
                icon: Package,
            },
        ],
    },
    {
        title: 'Alumni & LMS',
        items: [
            {
                title: 'Alumni Profiles',
                href: '/admin/alumni',
                icon: UsersRound,
            },
            {
                title: 'Career Placements',
                href: '/admin/career-placements',
                icon: Briefcase,
            },
            {
                title: 'Donations',
                href: '/admin/donations',
                icon: HeartHandshake,
            },
            { title: 'LMS Courses', href: '/admin/lms-courses', icon: Monitor },
        ],
    },
    {
        title: 'System',
        items: [
            { title: 'Users', href: '/admin/users', icon: UserCog },
            {
                title: 'Semester',
                href: '/admin/semester',
                icon: CalendarCheck,
            },
            {
                title: 'Threat Alerts',
                href: '/admin/threat-alerts',
                icon: ShieldAlert,
            },
            {
                title: 'Activity Logs',
                href: '/admin/activity-logs',
                icon: Activity,
            },
            { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
            { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
            { title: 'Roles', href: '/admin/roles', icon: ShieldCheck },
            {
                title: 'System Config',
                href: '/admin/system-config',
                icon: Settings,
            },
            {
                title: 'Session Logs',
                href: '/admin/session-logs',
                icon: History,
            },
        ],
    },
    {
        title: 'Payroll & HR',
        items: [
            {
                title: 'Salary Grades',
                href: '/admin/payroll/salary-grades',
                icon: Hotel,
            },
            {
                title: 'Payroll Periods',
                href: '/admin/payroll/periods',
                icon: DollarSign,
            },
            {
                title: 'Leave Requests',
                href: '/admin/payroll/leave-requests',
                icon: Plane,
            },
        ],
    },
];

function NavGroup({ section }: { section: NavSection }) {
    const { isCurrentUrl } = useCurrentUrl();
    const isDashboard = section.title === 'Dashboard';

    const isAnyActive = section.items.some(
        (item) =>
            isCurrentUrl(item.href, undefined, true) ||
            (item.title === 'Dashboard' && isCurrentUrl(item.href)),
    );
    const [open, setOpen] = useState(isAnyActive);

    if (isDashboard) {
        const item = section.items[0];
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl(item.href)}
                        tooltip={{ children: item.title }}
                        size="lg"
                    >
                        <Link href={item.href} prefetch>
                            <IconWrapper icon={item.icon} className="size-5" />
                            <span className="text-base font-semibold">
                                {item.title}
                            </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="mb-1 w-full justify-start gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase hover:text-foreground">
                    <ChevronRight
                        className={cn(
                            'size-3 shrink-0 transition-transform',
                            open && 'rotate-90',
                        )}
                    />
                    {section.title}
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenu>
                    {section.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(
                                    item.href,
                                    undefined,
                                    true,
                                )}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    <IconWrapper
                                        icon={item.icon}
                                        className="size-4"
                                    />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </CollapsibleContent>
        </Collapsible>
    );
}

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth?.roles?.some((r: string) =>
        ['admin', 'superadmin'].includes(r),
    );

    const visibleSections = isAdmin
        ? navSections
        : navSections.filter((s) => s.title !== 'System');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                {visibleSections.map((section) => (
                    <NavGroup key={section.title} section={section} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
