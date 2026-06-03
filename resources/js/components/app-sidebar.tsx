import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    ShieldAlert,
    Activity,
    Users,
    Settings,
    FileText,
    ShieldCheck,
    GraduationCap,
    BookMarked,
    ClipboardList,
    Library,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
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
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: FileText,
    },
    {
        title: 'Role Permissions',
        href: '/admin/roles',
        icon: ShieldCheck,
    },
    {
        title: 'System Config',
        href: '/admin/system-config',
        icon: Settings,
    },
];

const universityNavItems: NavItem[] = [
    {
        title: 'Courses',
        href: '/admin/courses',
        icon: BookMarked,
    },
    {
        title: 'Lectures',
        href: '/admin/lectures',
        icon: GraduationCap,
    },
    {
        title: 'Exams',
        href: '/admin/exams',
        icon: ClipboardList,
    },
    {
        title: 'Students',
        href: '/admin/students',
        icon: Library,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth?.roles?.some((r: string) =>
        ['admin', 'superadmin'].includes(r),
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isAdmin && (
                    <>
                        <SidebarMenu>
                            <SidebarMenuButton className="px-2 py-0">
                                <span className="px-2 text-xs font-medium text-muted-foreground">
                                    Admin
                                </span>
                            </SidebarMenuButton>
                            {adminNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={window.location.pathname.startsWith(
                                            item.href,
                                        )}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        <SidebarMenu>
                            <SidebarMenuButton className="px-2 py-0">
                                <span className="px-2 text-xs font-medium text-muted-foreground">
                                    University
                                </span>
                            </SidebarMenuButton>
                            {universityNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={window.location.pathname.startsWith(
                                            item.href,
                                        )}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
