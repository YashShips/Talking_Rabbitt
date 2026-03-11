"use client";

import { Dataset } from "@/app/page";
import { Table as TableIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DatasetPreviewProps {
    dataset: Dataset | null;
}

export function DatasetPreview({ dataset }: DatasetPreviewProps) {
    if (!dataset) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 z-10 relative">
                <TableIcon className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-mono text-sm tracking-widest uppercase">Awaiting Dataset Upload</p>
                <div className="w-32 h-[1px] bg-white/10 mt-6" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col z-10 relative bg-black/40"
        >
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold tracking-wide text-white">DATASET_PREVIEW</h3>
                </div>
                <div className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-muted-foreground">
                    Showing 10 / {dataset.allRows.length} rows
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-white/5 sticky top-0 backdrop-blur-md">
                        <tr>
                            {dataset.headers.map((header, idx) => (
                                <th key={idx} className="px-4 py-3 font-mono border-b border-white/10 whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataset.previewRows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                            >
                                {dataset.headers.map((header, colIndex) => (
                                    <td key={colIndex} className="px-4 py-3 text-white/80 whitespace-nowrap group-hover:text-white">
                                        {row[header] !== null && row[header] !== undefined
                                            ? String(row[header])
                                            : <span className="text-muted-foreground/50">null</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
