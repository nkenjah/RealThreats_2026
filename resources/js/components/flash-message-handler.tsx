import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export function FlashMessageHandler() {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };
    const shown = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (flash?.success && !shown.current.has(flash.success)) {
            shown.current.add(flash.success);
            toast.success(flash.success);
        }
        if (flash?.error && !shown.current.has(flash.error)) {
            shown.current.add(flash.error);
            toast.error(flash.error);
        }
    }, [flash]);

    return null;
}
