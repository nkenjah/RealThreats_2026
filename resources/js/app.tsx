import { createInertiaApp, router } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Initialize Laravel Echo with Reverb for real-time threat monitoring
if (typeof window !== 'undefined' && import.meta.env.VITE_REVERB_APP_KEY) {
    Promise.all([import('pusher-js'), import('laravel-echo')]).then(
        ([pusherMod, echoMod]) => {
            const PusherConstructor =
                (pusherMod as Record<string, unknown>).default || pusherMod;
            const Pusher =
                (PusherConstructor as Record<string, unknown>).Pusher ||
                PusherConstructor;
            if (typeof Pusher !== 'function') return;
            window.Pusher = Pusher;
            const Echo =
                (echoMod as Record<string, unknown>).default || echoMod;
            window.Echo = new (Echo as new (...args: unknown[]) => {
                channel: (name: string) => {
                    listen: (
                        event: string,
                        callback: (...args: unknown[]) => void,
                    ) => void;
                };
                leaveChannel: (name: string) => void;
            })({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_REVERB_APP_KEY,
                wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
                wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
                wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
                forceTLS:
                    (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
                enabledTransports: ['ws', 'wss'],
            });

            const adminChannel = window.Echo.channel('admin-alerts');
            adminChannel.listen('.ThreatDetectedEvent', () => router.reload());
            adminChannel.listen('.AccountLockedEvent', () => router.reload());
            adminChannel.listen('.SuspiciousLoginEvent', () => router.reload());
            adminChannel.listen('.GradeSubmittedEvent', () => router.reload());
            adminChannel.listen('.GradeApprovedEvent', () => router.reload());
            adminChannel.listen('.FeePaymentReceivedEvent', () =>
                router.reload(),
            );
            adminChannel.listen('.SemesterStatusChangedEvent', () =>
                router.reload(),
            );

            const threatsChannel = window.Echo.channel('threats');
            threatsChannel.listen('.ThreatDetectedEvent', () =>
                router.reload(),
            );
            threatsChannel.listen('.ThreatMitigatedEvent', () =>
                router.reload(),
            );
        },
    );
}
