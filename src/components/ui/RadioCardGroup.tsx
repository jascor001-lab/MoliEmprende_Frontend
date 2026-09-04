"use client";

import { motion } from "framer-motion";
import {
  Book,
  Briefcase,
  Building2,
  Circle,
  Cpu,
  Ellipsis,
  Globe,
  Gem,
  Hand,
  Heart,
  Home,
  Key,
  Landmark,
  Layers,
  Lightbulb,
  Paintbrush,
  Palette,
  Rocket,
  Scissors,
  ScrollText,
  Shirt,
  Sparkles,
  Store,
  TreePine,
  Users,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { RadioCardOption } from "@/types/form";

const ICON_MAP: Record<string, LucideIcon> = {
  rocket: Rocket,
  palette: Palette,
  lightbulb: Lightbulb,
  briefcase: Briefcase,
  building: Building2,
  sparkles: Sparkles,
  hand: Hand,
  home: Home,
  key: Key,
  users: Users,
  scroll: ScrollText,
  landmark: Landmark,
  utensils: Utensils,
  cpu: Cpu,
  shirt: Shirt,
  wrench: Wrench,
  heart: Heart,
  book: Book,
  scissors: Scissors,
  circle: Circle,
  layers: Layers,
  tree: TreePine,
  gem: Gem,
  globe: Globe,
  store: Store,
  paintbrush: Paintbrush,
  ellipsis: Ellipsis,
};

interface RadioCardGroupProps<T extends string> {
  options: RadioCardOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3;
  size?: "sm" | "md" | "lg";
}

export function RadioCardGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
  size = "md",
}: RadioCardGroupProps<T>) {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";
  const paddingClass = size === "sm" ? "p-3" : size === "lg" ? "p-6" : "p-4";
  const iconSize = size === "sm" ? 18 : size === "lg" ? 28 : 22;

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {options.map((option) => {
        const isSelected = value !== undefined && value === option.value;
        const Icon = option.icon ? ICON_MAP[option.icon] : null;

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative ${paddingClass} rounded-xl border-2 text-left transition-all duration-200
              backdrop-blur-sm
              ${
                isSelected
                  ? "border-molina bg-molina/10 shadow-glass ring-2 ring-molina/30"
                  : "border-slate-200/80 bg-white/70 hover:border-molina/40 hover:bg-white/90 hover:shadow-md"
              }
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="radio-card-indicator"
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-molina/5 to-molina-light/10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <div className="relative flex items-start gap-3">
              {Icon && (
                <div
                  className={`
                    flex shrink-0 items-center justify-center rounded-lg p-2
                    ${isSelected ? "bg-molina text-white" : "bg-slate-100 text-molina"}
                  `}
                >
                  <Icon size={iconSize} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p
                  className={`font-semibold leading-tight ${
                    isSelected ? "text-molina-dark" : "text-slate-700"
                  }`}
                >
                  {option.label}
                </p>
                {option.description && (
                  <p className="mt-1 text-sm text-slate-500 leading-snug">
                    {option.description}
                  </p>
                )}
              </div>

              <div
                className={`
                  mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
                  ${isSelected ? "border-molina bg-molina" : "border-slate-300"}
                `}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

interface CheckboxCardProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxCard({
  label,
  description,
  checked,
  onChange,
}: CheckboxCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200
        backdrop-blur-sm
        ${
          checked
            ? "border-molina bg-molina/10 shadow-glass"
            : "border-slate-200/80 bg-white/70 hover:border-molina/40"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2
            ${checked ? "border-molina bg-molina" : "border-slate-300 bg-white"}
          `}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </div>
        <div>
          <p className={`font-medium ${checked ? "text-molina-dark" : "text-slate-700"}`}>
            {label}
          </p>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
