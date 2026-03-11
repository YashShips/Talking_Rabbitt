"use client";

import { useState } from "react";
import { UploadPanel } from "@/components/UploadPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { ChartPanel } from "@/components/ChartPanel";
import { DatasetPreview } from "@/components/DatasetPreview";
import { InsightCard } from "@/components/InsightCard";

// Types
export type Dataset = {
  filename: string;
  headers: string[];
  previewRows: Record<string, unknown>[];
  allRows: Record<string, unknown>[];
};

export type ChartConfig = {
  type: "bar" | "line" | "pie";
  data: Record<string, unknown>[];
  xAxisKey: string;
  yAxisKey: string;
  title: string;
};

export default function Home() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);
  const [currentInsight, setCurrentInsight] = useState<string | null>(null);

  return (
    <div className="flex h-full w-full overflow-hidden bg-background text-foreground relative z-10">

      {/* LEFT SIDEBAR: Upload & Metadata */}
      <aside className="w-80 border-r border-white/10 glass-card bg-black/40 p-4 flex flex-col gap-6 z-20 overflow-y-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary glow-purple animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Data Source</h2>
        </div>

        <UploadPanel onUpload={setDataset} />

        {dataset && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="p-4 rounded-md border border-white/5 bg-white/5 backdrop-blur-sm">
              <h3 className="font-mono text-sm text-primary mb-2">METADATA</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>File:</span>
                  <span className="text-white truncate max-w-[150px]">{dataset.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rows:</span>
                  <span className="text-white">{dataset.allRows.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Columns:</span>
                  <span className="text-white">{dataset.headers.length}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-md border border-white/5 bg-white/5 backdrop-blur-sm">
              <h3 className="font-mono text-sm text-secondary mb-2">EXAMPLE QUERIES</h3>
              <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
                <li>Which region generated the highest revenue?</li>
                <li>Show revenue trends over time</li>
                <li>Compare product sales by region</li>
                <li>What product sells the most?</li>
              </ul>
            </div>
          </div>
        )}
      </aside>

      {/* CENTER WORKSPACE: Preview & Visualization */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative">
        <div className="h-[45%] border-b border-white/10 relative overflow-hidden bg-black/30">
          {/* Subtle gradient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/5 blur-[100px] pointer-events-none" />
          <DatasetPreview dataset={dataset} />
        </div>
        <div className="h-[55%] relative flex flex-col bg-black/50 p-6 overflow-y-auto">
          {/* AI Insight Section */}
          <InsightCard insight={currentInsight} />

          {/* Chart Section */}
          <div className="flex-1 min-h-[300px]">
            <ChartPanel config={chartConfig} />
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR: AI Chat Panel */}
      <aside className="w-96 border-l border-white/10 glass-card bg-black/40 z-20 flex flex-col">
        <ChatPanel
          dataset={dataset}
          onChartUpdate={(config) => setChartConfig(config)}
          onInsightUpdate={(insight) => setCurrentInsight(insight)}
        />
      </aside>

    </div>
  );
}
