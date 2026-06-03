import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export function useFlashToast(): void {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;
    const shownRef = useRef<string | null>(null);

    useEffect(() => {
        if (!flash) return;

        const key = JSON.stringify(flash);
        if (shownRef.current === key) return;
        shownRef.current = key;

        if (flash.success) {
            toast.success(flash.success, { position: 'top-right' });
        }
        if (flash.error) {
            toast.error(flash.error, { position: 'top-right' });
        }
    }, [flash]);
}
