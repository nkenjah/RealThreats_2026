import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { TriangleAlert } from 'lucide-react';

export default function RiskWarningToast() {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const checkRisk = async () => {
            try {
                const res = await fetch('/risk-warning');
                const data = await res.json();

                if (data.warning) {
                    toast.warning(
                        `High Risk Alert: Score ${data.score}/100. ${data.reason ?? 'Immediate action recommended.'}`,
                        {
                            position: 'top-left',
                            duration: 10000,
                            icon: (
                                <TriangleAlert className="h-5 w-5 text-yellow-500" />
                            ),
                            className:
                                'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/30',
                        },
                    );
                }
            } catch {
                // silent
            }
        };

        checkRisk();
        intervalRef.current = setInterval(checkRisk, 60000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return null;
}
