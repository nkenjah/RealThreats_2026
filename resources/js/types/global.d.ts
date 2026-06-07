import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            notifications: AppNotification[];
            unread_count: number;
            flash?: { success?: string; error?: string };
            [key: string]: unknown;
        };
    }
}

interface AppNotification {
    id: string;
    type: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
}

declare global {
    interface Window {
        Pusher: unknown;
        Echo: {
            channel: (name: string) => {
                listen: (
                    event: string,
                    callback: (...args: unknown[]) => void,
                ) => void;
            };
            leaveChannel: (name: string) => void;
        };
    }
}

export {};
