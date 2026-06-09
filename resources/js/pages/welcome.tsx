

import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

import {
    Shield, Activity, AlertTriangle, Eye, Lock,
    Zap, ChevronRight, Database
} from "lucide-react";
const heroImage = "herosection.jpg";

export default function Welcome({ canRegister = true }) {
    const { auth } = usePage().props;

    const features = [
        { icon: Eye, title: "Real-Time Monitoring", desc: "Continuously track user behavior, file access, and network activity across your organization." },
        { icon: Activity, title: "Behavioral Analytics", desc: "ML-driven anomaly detection identifies deviations from baseline user patterns instantly." },
        { icon: AlertTriangle, title: "Threat Alerts", desc: "Receive prioritized alerts the moment suspicious insider activity is detected." },
        { icon: Lock, title: "Automated Response", desc: "Quarantine sessions, revoke access, and trigger containment workflows automatically." },
        { icon: Database, title: "Audit & Compliance", desc: "Immutable logs and reporting aligned with SOC 2, ISO 27001, and HIPAA standards." },
        { icon: Zap, title: "Risk Scoring", desc: "Dynamic risk scores per user, updated in real time based on context and activity." },
    ];

    const stats = [
        { value: "60%", label: "of breaches involve insiders" },
        { value: "<200ms", label: "detection latency" },
        { value: "24/7", label: "continuous protection" },
        { value: "99.9%", label: "uptime SLA" },
    ];

    const dashboardUrl = "/dashboard";
    const loginUrl = "/login";
    const registerUrl = "/register";

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Head title="SentinelIQ - Insider Threat Mitigation" />

            {/* Nav */}
            <header className="fixed top-0 inset-x-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
                <nav className="container flex items-center justify-between h-16 px-4 md:px-6">
                    <a href="#" className="flex items-center gap-2 font-bold text-lg">
                        <div className="relative">
                            <Shield className="h-7 w-7 text-primary" />
                            <div className="absolute inset-0 blur-md bg-primary/40 -z-10" />
                        </div>
                        <span>Sentinel<span className="text-primary">IQ</span></span>
                    </a>
                    <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
                        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                        <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
                        <a href="#stats" className="hover:text-foreground transition-colors">Impact</a>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link href={dashboardUrl} className="btn-custom py-1.5 px-4 text-sm bg-primary text-primary-foreground rounded-md">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={loginUrl} className="px-4 py-1.5 text-sm hover:text-primary transition-colors">Log in</Link>
                                {canRegister && (
                                    <Link href={registerUrl} className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="container relative grid lg:grid-cols-2 gap-12 items-center px-4 md:px-6">
                    <div className="space-y-6 text-center lg:text-left">
                        <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 px-3 py-1 mx-auto lg:mx-0">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                            </span>
                            Live Threat Detection
                        </Badge>

                        <motion.h1
                            className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            Stop insider threats{" "}
                            <motion.span
                                className="text-primary d-inline-block"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                before they breach
                            </motion.span>
                        </motion.h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                            A real-time insider threat mitigation and control system that detects, scores, and neutralizes risky behavior across your workforce — autonomously.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90">
                                Get Started <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline">
                                View Live Demo
                            </Button>
                        </div>
                    </div>
                    <div className="relative animate-float mx-auto lg:mx-0">
                        <div className="absolute -inset-4 bg-primary opacity-20 blur-3xl rounded-full" />
                        <img
                            src={heroImage}
                            alt="Visualization"
                            className="relative rounded-2xl border border-border shadow-2xl max-w-full h-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section id="stats" className="py-16 border-y border-border/50 bg-card/30">
                <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                            <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24">
                <div className="container px-4">
                    <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
                        <Badge variant="outline" className="border-primary/40 text-primary">Core Capabilities</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Defense from the inside out</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <Card key={f.title} className="p-6 bg-card border-border/50 hover:border-primary/40 transition-all group">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <f.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground">{f.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 py-10 bg-background">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground px-4">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">SentinelIQ</span>
                        <span>© {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-foreground">Privacy</a>
                        <a href="#" className="hover:text-foreground">Security</a>
                        <a href="#" className="hover:text-foreground">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}