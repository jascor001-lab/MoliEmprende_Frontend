"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface FileDropzoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
  title?: string;
  hint?: string;
  ariaLabel?: string;
}

export function FileDropzone({
  value,
  onChange,
  error,
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  title = "Arrastra tu archivo aquí o haz clic para seleccionar",
  hint = "PDF o imagen (JPG, PNG) — máx. 5 MB",
  ariaLabel = "Adjuntar archivo",
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      onChange(file);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {!value ? (
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          animate={{
            borderColor: isDragging ? "#008A4B" : error ? "#ef4444" : "#e2e8f0",
            backgroundColor: isDragging ? "rgba(0,138,75,0.05)" : "rgba(255,255,255,0.7)",
          }}
          className="relative rounded-xl border-2 border-dashed p-8 text-center backdrop-blur-sm transition-colors"
        >
          <input
            type="file"
            accept={accept}
            onChange={onInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={ariaLabel}
          />
          <Upload className="mx-auto h-10 w-10 text-molina/60" />
          <p className="mt-3 font-medium text-slate-700">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{hint}</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-molina/30 bg-molina/5 p-4"
        >
          <FileText className="h-8 w-8 shrink-0 text-molina" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-700">{value.name}</p>
            <p className="text-sm text-slate-500">
              {(value.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors"
            aria-label="Eliminar archivo"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
      {error && (
        <p className="flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
