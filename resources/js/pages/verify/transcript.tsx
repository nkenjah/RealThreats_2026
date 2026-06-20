import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft, GraduationCap } from 'lucide-react';
import type { PageProps } from '@/types';

interface Props extends PageProps {
    valid: boolean;
    transcript: {
        student_name: string;
        registration_number: string;
        program: string;
        cumulative_gpa: number;
        total_credits: number;
        generated_at: string;
    };
}

export default function VerifyTranscript({ valid, transcript }: Props) {
    if (!valid) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
                <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
                    <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-red-400" />
                    <h1 className="mb-2 text-xl font-bold">
                        Invalid Transcript
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        This verification code is invalid or the transcript has
                        been revoked.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Verify Transcript" />
            <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
                <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
                    <div className="mb-6 text-center">
                        <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-green-500" />
                        <h1 className="text-xl font-bold text-green-700">
                            Verified Document
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            This is an official KIUT University academic
                            transcript
                        </p>
                    </div>

                    <div className="space-y-3 rounded-lg bg-green-50 p-4 dark:bg-green-950">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="size-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium">
                                    {transcript.student_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {transcript.registration_number}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Program
                                </p>
                                <p className="font-medium">
                                    {transcript.program}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    CGPA
                                </p>
                                <p className="font-medium">
                                    {Number(transcript.cumulative_gpa).toFixed(
                                        2,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Total Credits
                                </p>
                                <p className="font-medium">
                                    {transcript.total_credits}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Issued
                                </p>
                                <p className="font-medium">
                                    {transcript.generated_at}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground">
                            This verification confirms the transcript was issued
                            by KIUT University and has not been tampered with.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
