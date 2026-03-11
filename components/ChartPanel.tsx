"use client";

import { ChartConfig } from "@/app/page";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ChartPanelProps {
    config: ChartConfig | null;
}

const CYBERPUNK_COLORS = [
    "#0ff",     // Cyan
    "#b026ff",  // Purple
    "#0088ff",  // Electric Blue
    "#ff2a2a",  // Neon Red
    "#39ff14",  // Neon Green
    "#ff00ff"   // Magenta
];

export function ChartPanel({ config }: ChartPanelProps) {
    if (!config) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 z-10 relative">
                <Activity className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-mono text-sm tracking-widest uppercase">Awaiting Analysis Parameters</p>
            </div>
        );
    }

    const renderChart = () => {
        switch (config.type) {
            case "bar":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={config.data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey={config.xAxisKey} stroke="#ffffff50" tick={{ fill: "#ffffff80", fontSize: 12 }} />
                            <YAxis stroke="#ffffff50" tick={{ fill: "#ffffff80", fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#000000cc", border: "1px solid #0ff", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,255,255,0.2)" }}
                                itemStyle={{ color: "#0ff" }}
                            />
                            <Legend />
                            <Bar dataKey={config.yAxisKey} fill="#0ff" radius={[4, 4, 0, 0]}>
                                {config.data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={CYBERPUNK_COLORS[index % CYBERPUNK_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            case "line":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={config.data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey={config.xAxisKey} stroke="#ffffff50" tick={{ fill: "#ffffff80", fontSize: 12 }} />
                            <YAxis stroke="#ffffff50" tick={{ fill: "#ffffff80", fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#000000cc", border: "1px solid #b026ff", borderRadius: "8px", boxShadow: "0 0 10px rgba(176,38,255,0.2)" }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey={config.yAxisKey} stroke="#b026ff" strokeWidth={3} dot={{ r: 4, fill: "#b026ff" }} activeDot={{ r: 8, fill: "#fff" }} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case "pie":
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <Tooltip
                                contentStyle={{ backgroundColor: "#000000cc", border: "1px solid #0088ff", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,136,255,0.2)" }}
                            />
                            <Legend />
                            <Pie
                                data={config.data}
                                dataKey={config.yAxisKey}
                                nameKey={config.xAxisKey}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                innerRadius={60}
                                paddingAngle={5}
                            >
                                {config.data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={CYBERPUNK_COLORS[index % CYBERPUNK_COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col p-4 bg-gradient-to-b from-transparent to-black/60 relative"
        >
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse glow-cyan" />
                <h3 className="text-sm font-semibold tracking-wide text-white font-mono uppercase">
                    {config.title}
                </h3>
            </div>

            <div className="flex-1 mt-8 w-full">
                {renderChart()}
            </div>
        </motion.div>
    );
}
