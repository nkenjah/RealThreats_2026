import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';
import { Shield, Activity, Lock, Bell } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="KIUT Insider Threat Mitigation System" />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <header className="flex items-center justify-between px-6 py-4 lg:px-12">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
                            <Shield className="h-5 w-5 text-slate-900" />
                        </div>
                        <span className="text-lg font-bold">
                            KIUT Threat Monitor
                        </span>
                    </div>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-lg border border-slate-600 px-5 py-2 text-sm font-medium transition hover:border-slate-500"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="flex flex-1 flex-col items-center justify-center px-6 text-center lg:px-12">
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
                        <Shield className="h-10 w-10 text-amber-500" />
                    </div>
                    <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight lg:text-6xl">
                        Insider Threat Mitigation System
                    </h1>
                    <p className="mb-12 max-w-2xl text-lg text-slate-400">
                        Kampala International University of Tanzania — Real-time
                        monitoring, detection, and automated response to insider
                        security threats across the university network.
                    </p>

                    <div className="mb-16 grid gap-6 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-left">
                            <Activity className="mb-3 h-6 w-6 text-amber-500" />
                            <h3 className="mb-2 font-semibold">
                                Real-Time Monitoring
                            </h3>
                            <p className="text-sm text-slate-400">
                                Continuous activity tracking across all user
                                accounts and systems.
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-left">
                            <Lock className="mb-3 h-6 w-6 text-amber-500" />
                            <h3 className="mb-2 font-semibold">
                                Automated Response
                            </h3>
                            <p className="text-sm text-slate-400">
                                Instant kill-switch actions when threat
                                thresholds are exceeded.
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-left">
                            <Bell className="mb-3 h-6 w-6 text-amber-500" />
                            <h3 className="mb-2 font-semibold">
                                Instant Alerts
                            </h3>
                            <p className="text-sm text-slate-400">
                                Real-time notifications via WebSocket and email
                                for security teams.
                            </p>
                        </div>
                    </div>

                    <div className="text-center text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} Kampala International
                        University of Tanzania. All rights reserved.
                    </div>
                </main>
            </div>
        </>
    );
}
