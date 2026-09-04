"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium text-molina">
          Paso {currentStep + 1} de {totalSteps}
        </span>
        <span className="text-slate-500">{labels[currentStep]}</span>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-slate-200/80">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-molina"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      <div className="mt-3 hidden sm:flex justify-between gap-2">
        {labels.map((label, index) => (
          <div
            key={label}
            className={`flex-1 text-center text-xs font-medium transition-colors ${
              index <= currentStep ? "text-molina" : "text-slate-400"
            }`}
          >
            <div
              className={`mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                index < currentStep
                  ? "bg-molina text-white"
                  : index === currentStep
                    ? "bg-molina/20 text-molina ring-2 ring-molina"
                    : "bg-slate-200 text-slate-400"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className="line-clamp-2">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
