import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    QrCode,
    Camera,
    UserCheck,
    Loader2,
    CheckCircle2,
    XCircle,
    Search,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Exam {
    id: number;
    course: string;
    code: string;
    starts_at: string;
    venue: string;
}

interface Props {
    exam: Exam;
    today: string;
}

interface ScanResult {
    status: string;
    message: string;
    student: { name: string; reg: string };
}

export default function ExamAttendanceScanner({ exam, today }: Props) {
    const [scannerStarted, setScannerStarted] = useState(false);
    const [manualReg, setManualReg] = useState('');
    const [results, setResults] = useState<ScanResult[]>([]);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scannerRef = useRef<any>(null);

    const processCheckIn = useCallback(
        async (reg: string) => {
            if (!reg.trim()) return;
            setScanning(true);
            setError(null);
            try {
                const res = await fetch(
                    `/admin/exam-attendance/${exam.id}/check-in`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': (window as any).csrfToken ?? '',
                        },
                        body: JSON.stringify({
                            registration_number: reg.trim(),
                        }),
                    },
                );
                const data = await res.json();
                setResults((prev) => [data, ...prev]);
                setManualReg('');
            } catch (e: any) {
                setError(e.message || 'Check-in failed');
            } finally {
                setScanning(false);
            }
        },
        [exam.id],
    );

    const startScanner = useCallback(async () => {
        setScannerStarted(true);
        try {
            const { Html5Qrcode } = await import('html5-qrcode');
            const scanner = new Html5Qrcode('qr-reader');
            scannerRef.current = scanner;
            await scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText: string) => {
                    scanner.stop().catch(() => {});
                    setScannerStarted(false);
                    processCheckIn(decodedText.trim());
                },
                () => {},
            );
        } catch (e: any) {
            setError(
                'Camera access denied or not available. Use manual entry.',
            );
            setScannerStarted(false);
        }
    }, [processCheckIn]);

    const stopScanner = useCallback(() => {
        if (scannerRef.current) {
            scannerRef.current.stop().catch(() => {});
            scannerRef.current = null;
        }
        setScannerStarted(false);
    }, []);

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, [stopScanner]);

    return (
        <>
            <Head title="Exam Attendance Scanner" />
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/exam-attendance">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            Exam Attendance Scanner
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {exam.code} - {exam.course}
                        </p>
                    </div>
                </div>

                {/* Exam Info Bar */}
                <div className="flex gap-4 rounded-lg border bg-card p-3 text-sm">
                    <div>
                        <span className="text-muted-foreground">Venue:</span>{' '}
                        <strong>{exam.venue}</strong>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Time:</span>{' '}
                        <strong>{exam.starts_at}</strong>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Date:</span>{' '}
                        <strong>{today}</strong>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Scanner Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium">
                                Scan Student QR
                            </h2>
                            {!scannerStarted ? (
                                <Button size="sm" onClick={startScanner}>
                                    <Camera className="mr-2 h-4 w-4" />
                                    Start Camera
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={stopScanner}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Stop Camera
                                </Button>
                            )}
                        </div>

                        <div
                            id="qr-reader"
                            className={cn(
                                'overflow-hidden rounded-lg border bg-black',
                                scannerStarted
                                    ? 'min-h-[300px]'
                                    : 'flex min-h-[200px] items-center justify-center',
                            )}
                        >
                            {!scannerStarted && (
                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <QrCode className="h-12 w-12" />
                                    <p className="text-sm">
                                        Camera off. Click "Start Camera" to scan
                                        QR codes.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Manual Entry */}
                        <div className="rounded-lg border bg-card p-4">
                            <h3 className="mb-2 text-sm font-medium">
                                Manual Entry
                            </h3>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        value={manualReg}
                                        onChange={(e) =>
                                            setManualReg(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' &&
                                            processCheckIn(manualReg)
                                        }
                                        placeholder="Enter registration number..."
                                        className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                    />
                                </div>
                                <Button
                                    onClick={() => processCheckIn(manualReg)}
                                    disabled={!manualReg.trim() || scanning}
                                >
                                    {scanning ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <UserCheck className="mr-2 h-4 w-4" />
                                    )}
                                    Check In
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                <XCircle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results Column */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-sm font-medium">
                                Recent Check-ins
                                <span className="ml-2 text-xs text-muted-foreground">
                                    ({results.length})
                                </span>
                            </h2>
                        </div>
                        <div className="max-h-[500px] space-y-2 overflow-y-auto rounded-lg border bg-card p-2">
                            {results.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
                                    <UserCheck className="h-8 w-8" />
                                    No check-ins yet
                                </div>
                            ) : (
                                results.map((r, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'flex items-center gap-3 rounded-md border p-3 text-sm',
                                            r.status === 'checked_in'
                                                ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                                                : 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950',
                                        )}
                                    >
                                        {r.status === 'checked_in' ? (
                                            <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                                        ) : (
                                            <UserCheck className="size-5 shrink-0 text-yellow-500" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {r.student.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {r.student.reg}
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date().toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ExamAttendanceScanner.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Exam Attendance', href: '/admin/exam-attendance' },
        { title: 'Scanner', href: '' },
    ],
};
