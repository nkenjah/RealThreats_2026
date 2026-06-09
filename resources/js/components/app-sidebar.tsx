import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BookMarked,
    Building2,
    ChevronRight,
    ClipboardList,
    FileText,
    GraduationCap,
    Home,
    Landmark,
    LayoutGrid,
    Library,
    School,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Users,
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
        items: [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }],
    },
    {
        title: 'Academic',
        items: [
            { title: 'Courses', href: '/admin/courses', icon: BookMarked },
            { title: 'Lectures', href: '/admin/lectures', icon: GraduationCap },
            { title: 'Exams', href: '/admin/exams', icon: ClipboardList },
            { title: 'Students', href: '/admin/students', icon: Users },
            { title: 'Programs', href: '/admin/programs', icon: GraduationCap },
            { title: 'Offerings', href: '/admin/offerings', icon: BookMarked },
            {
                title: 'Enrollments',
                href: '/admin/enrollments',
                icon: ClipboardList,
            },
            {
                title: 'Timetables',
                href: '/admin/timetables',
                icon: ClipboardList,
            },
            { title: 'Faculty', href: '/admin/faculty', icon: Users },
            { title: 'Grades', href: '/admin/grades', icon: FileText },
            {
                title: 'Gradebook Components',
                href: '/admin/gradebook-components',
                icon: FileText,
            },
            {
                title: 'Final Term Grades',
                href: '/admin/final-term-grades',
                icon: FileText,
            },
            {
                title: 'Attendance',
                href: '/admin/attendance',
                icon: ClipboardList,
            },
        ],
    },
    // {
    //     title: 'Curriculum',
    //     items: [
    //         {
    //             title: 'Program Requirements',
    //             href: '/admin/curriculum/program-requirements',
    //             icon: FileText,
    //         },
    //         {
    //             title: 'Course Prerequisites',
    //             href: '/admin/curriculum/course-prerequisites',
    //             icon: BookMarked,
    //         },
    //     ],
    // },
    // {
    //     title: 'Academic Records',
    //     items: [
    //         {
    //             title: 'Transcripts',
    //             href: '/admin/academics/transcripts',
    //             icon: FileText,
    //         },
    //         {
    //             title: 'Degree Audits',
    //             href: '/admin/academics/degree-audits',
    //             icon: FileText,
    //         },
    //     ],
    // },
    // {
    //     title: 'Admissions',
    //     items: [
    //         {
    //             title: 'Prospects',
    //             href: '/admin/admissions/prospects',
    //             icon: Users,
    //         },
    //         {
    //             title: 'Applications',
    //             href: '/admin/admissions/applications',
    //             icon: FileText,
    //         },
    //         {
    //             title: 'Offers',
    //             href: '/admin/admissions/offers',
    //             icon: FileText,
    //         },
    //     ],
    // },
    // {
    //     title: 'Finance',
    //     items: [
    //         { title: 'Fees', href: '/admin/fees', icon: Landmark },
    //         {
    //             title: 'Financial Accounts',
    //             href: '/admin/financial-accounts',
    //             icon: Landmark,
    //         },
    //         { title: 'Payments', href: '/admin/payments', icon: Landmark },
    //         {
    //             title: 'Scholarships',
    //             href: '/admin/scholarship-awards',
    //             icon: Landmark,
    //         },
    //         {
    //             title: 'Fund Sources',
    //             href: '/admin/fund-sources',
    //             icon: Landmark,
    //         },
    //     ],
    // },
    // {
    //     title: 'Facilities',
    //     items: [
    //         { title: 'Campuses', href: '/admin/campuses', icon: Building2 },
    //         { title: 'Buildings', href: '/admin/buildings', icon: Building2 },
    //         { title: 'Rooms', href: '/admin/rooms', icon: Building2 },
    //     ],
    // },
    // {
    //     title: 'Library',
    //     items: [
    //         { title: 'Library Items', href: '/admin/library', icon: Library },
    //         {
    //             title: 'Library Fines',
    //             href: '/admin/library-fines',
    //             icon: Library,
    //         },
    //     ],
    // },
    // {
    //     title: 'LMS',
    //     items: [{ title: 'Courses', href: '/admin/lms-courses', icon: School }],
    // },
    // {
    //     title: 'Housing',
    //     items: [
    //         { title: 'Dormitories', href: '/admin/dormitories', icon: Home },
    //         { title: 'Hostels', href: '/admin/hostels', icon: Home },
    //     ],
    // },
    // {
    //     title: 'Alumni',
    //     items: [
    //         { title: 'Profiles', href: '/admin/alumni', icon: Users },
    //         {
    //             title: 'Career Placements',
    //             href: '/admin/career-placements',
    //             icon: Users,
    //         },
    //         { title: 'Donations', href: '/admin/donations', icon: Landmark },
    //     ],
    // },
    {
        title: 'System',
        items: [
            { title: 'Users', href: '/admin/users', icon: Users },
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
            { title: 'Reports', href: '/admin/reports', icon: FileText },
            { title: 'Roles', href: '/admin/roles', icon: ShieldCheck },
            {
                title: 'System Config',
                href: '/admin/system-config',
                icon: Settings,
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
