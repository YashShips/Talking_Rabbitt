"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Upload, FileType, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Dataset } from "@/app/page";

interface UploadPanelProps {
    onUpload: (dataset: Dataset) => void;
}

export function UploadPanel({ onUpload }: UploadPanelProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];

        if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
            setError("Please upload a valid CSV file.");
            return;
        }

        setIsUploading(true);
        setError(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                setIsUploading(false);
                if (results.errors.length > 0) {
                    setError("Error parsing the CSV file.");
                    console.error(results.errors);
                    return;
                }

                if (!results.data || results.data.length === 0) {
                    setError("The CSV file is empty.");
                    return;
                }

                const headers = results.meta.fields || Object.keys(results.data[0] as object);
                const parsedData = results.data as Record<string, unknown>[];
                const dataset: Dataset = {
                    filename: file.name,
                    headers,
                    previewRows: parsedData.slice(0, 10),
                    allRows: parsedData
                };

                onUpload(dataset);
            },
            error: (err) => {
                setIsUploading(false);
                setError(err.message);
            }
        });
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv']
        },
        maxFiles: 1
    });

    return (
        <div className="flex flex-col gap-4 w-full">
            <div
                {...getRootProps()}
                className={`relative group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${isDragActive
                        ? "border-primary bg-primary/10 glow-cyan"
                        : "border-white/20 bg-black/20 hover:border-primary/50 hover:bg-white/5"}
        `}
            >
                <input {...getInputProps()} />

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg glow-cyan" />

                {isUploading ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-primary"
                    >
                        <div className="w-10 h-10 border-t-2 border-r-2 border-primary rounded-full animate-spin mb-4" />
                        <p className="text-sm font-mono animate-pulse">Processing Data...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center text-muted-foreground group-hover:text-white transition-colors"
                    >
                        <Upload className={`w-10 h-10 mb-3 ${isDragActive ? "text-primary animate-bounce" : ""}`} />
                        <p className="mb-2 text-sm">
                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
                            <FileType className="w-3 h-3" /> CSV Files only
                        </p>
                    </motion.div>
                )}
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </motion.div>
            )}
        </div>
    );
}
