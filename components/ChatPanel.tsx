"use client";

import { useState, useRef, useEffect } from "react";
import { Dataset, ChartConfig } from "@/app/page";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
}

interface ChatPanelProps {
    dataset: Dataset | null;
    onChartUpdate: (config: ChartConfig) => void;
    onInsightUpdate?: (insight: string) => void;
}

export function ChatPanel({ dataset, onChartUpdate, onInsightUpdate }: ChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: "System initialized. Waiting for dataset upload."
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dataset && messages.length === 1 && messages[0].id === "1") {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "ai",
                    content: `Dataset "${dataset.filename}" loaded. What would you like to know about it?`
                }
            ]);
        }
    }, [dataset, messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !dataset) return;

        const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: userMessage.content,
                    datasetMeta: {
                        filename: dataset.filename,
                        headers: dataset.headers,
                        sampleData: dataset.previewRows
                    },
                    allRows: dataset.allRows, // Sending all data for MVP local processing (in production, we'd process on client or send to DB)
                })
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = "Failed to process request";

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json().catch(() => ({}));
                    errorMessage = errorData.error || errorMessage;
                } else {
                    const text = await response.text().catch(() => "");
                    console.error("RAW_ERROR_PAGE:", text);
                    errorMessage = `Server Error (${response.status}): ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.insight || "Analysis complete."
            };

            setMessages((prev) => [...prev, aiMessage]);

            if (data.chartConfig) {
                onChartUpdate(data.chartConfig);
            }

            if (data.insight && onInsightUpdate) {
                onInsightUpdate(data.insight);
            }

        } catch (error: any) {
            console.error(error);
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: `Error: ${error.message || "Failed to process your query."}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2 text-primary font-mono text-sm">
                    <Bot className="w-5 h-5" />
                    <span>AI_TERMINAL</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-secondary animate-pulse glow-purple' : 'bg-primary glow-cyan'}`} />
                    <span className="text-xs text-muted-foreground uppercase">{isLoading ? 'Processing' : 'Standby'}</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {msg.role === "user" ? (
                                    <>
                                        <span className="text-xs text-muted-foreground font-mono">USER</span>
                                        <User className="w-3 h-3 text-white/50" />
                                    </>
                                ) : (
                                    <>
                                        <Bot className="w-3 h-3 text-primary" />
                                        <span className="text-xs text-primary font-mono">SYSTEM</span>
                                    </>
                                )}
                            </div>
                            <div
                                className={`p-3 rounded-lg text-sm border backdrop-blur-md ${msg.role === "user"
                                    ? "bg-white/10 border-white/20 text-white rounded-tr-none"
                                    : "bg-primary/10 border-primary/30 text-primary-foreground rounded-tl-none glow-cyan text-white shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col mr-auto max-w-[85%] items-start"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-3 h-3 text-secondary animate-spin" />
                                <span className="text-xs text-secondary font-mono">ANALYZING</span>
                            </div>
                            <div className="p-3 rounded-lg flex gap-1 bg-secondary/10 border border-secondary/30 rounded-tl-none">
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/60 border-t border-white/10 relative z-10">
                {!dataset && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground uppercase font-mono tracking-widest">Upload dataset to begin</span>
                    </div>
                )}
                <div className="relative group flex items-center">
                    <input
                        type="text"
                        className="w-full bg-black/50 border border-white/20 rounded-md py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/50 group-focus-within:glow-cyan"
                        placeholder="Ask a question about the data..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={!dataset || isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!dataset || isLoading || !input.trim()}
                        className="absolute right-2 p-2 text-white/50 hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-white/50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
