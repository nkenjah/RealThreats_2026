import { router } from '@inertiajs/react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export function AiAssistant() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content:
                "Hello! I'm KIUT-AI, your university assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || loading) return;

        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: text }]);
        setLoading(true);

        try {
            const res = await fetch('/ai-assistant/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: text,
                    history: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.reply || 'Request failed');
            }

            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.reply },
            ]);
        } catch (error: any) {
            let errorMsg =
                error.message ||
                'Sorry, I encountered an unexpected error. Please try again.';
            if (errorMsg === 'Failed to fetch' || errorMsg === 'NetworkError') {
                errorMsg =
                    'Could not reach the AI service. Make sure the AI backend (Ollama) is running.';
            }
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: errorMsg,
                },
            ]);
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages]);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-lg"
                size="icon"
            >
                <MessageCircle className="size-6" />
            </Button>

            {open && (
                <div className="fixed right-4 bottom-20 z-50 flex h-[500px] w-[380px] flex-col rounded-xl border bg-background shadow-2xl">
                    <div className="flex items-center justify-between border-b p-3">
                        <div className="flex items-center gap-2">
                            <Bot className="size-5 text-primary" />
                            <span className="text-sm font-semibold">
                                KIUT-AI
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => setOpen(false)}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto p-3">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                                        msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    <div className="border-t p-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            className="flex gap-2"
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="size-9 shrink-0"
                                disabled={loading || !input.trim()}
                            >
                                <Send className="size-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
