"use client";

import { Instagram, Facebook, Globe, Music2 } from "lucide-react";
import { CheckboxCard } from "@/components/ui/RadioCardGroup";
import { PARTICIPATION_OPTIONS, type Step3Data, type ParticipationInterest } from "@/types/form";

interface Step3CommercialProps {
  data: Step3Data;
  errors: Partial<Record<keyof Step3Data, string>>;
  onChange: (field: keyof Step3Data, value: Step3Data[keyof Step3Data]) => void;
}

const SOCIAL_FIELDS = [
  { key: "instagram" as const, label: "Instagram", icon: Instagram, placeholder: "@tu_cuenta" },
  { key: "facebook" as const, label: "Facebook", icon: Facebook, placeholder: "facebook.com/tu_pagina" },
  { key: "tiktok" as const, label: "TikTok", icon: Music2, placeholder: "@tu_cuenta" },
  { key: "website" as const, label: "Sitio Web", icon: Globe, placeholder: "https://tunegocio.com" },
];

export function Step3Commercial({ data, errors, onChange }: Step3CommercialProps) {
  const toggleInterest = (interest: ParticipationInterest) => {
    const current = data.interests ?? [];
    if (current.includes(interest)) {
      onChange("interests", current.filter((i) => i !== interest));
    } else {
      onChange("interests", [...current, interest]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-molina-dark">
          Información Comercial y Apoyo Requerido
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Cuéntanos sobre tu emprendimiento y cómo podemos apoyarte.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-700">Redes sociales del emprendimiento</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key} className="space-y-1">
              <label htmlFor={key} className="flex items-center gap-2 text-sm text-slate-600">
                <Icon className="h-4 w-4 text-molina" />
                {label}
              </label>
              <input
                id={key}
                type="text"
                value={data[key] ?? ""}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border-2 border-slate-200 bg-white/80 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm transition-colors focus:border-molina focus:outline-none focus:ring-2 focus:ring-molina/30"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Breve descripción de productos / servicios
        </label>
        <textarea
          id="description"
          rows={4}
          value={data.description ?? ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe brevemente lo que ofrece tu emprendimiento o taller artesanal..."
          maxLength={500}
          className={`w-full rounded-xl border-2 bg-white/80 px-4 py-3 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-molina/30 resize-none ${
            errors.description ? "border-red-400" : "border-slate-200 focus:border-molina"
          }`}
        />
        <div className="flex justify-between text-xs text-slate-400">
          {errors.description ? (
            <p className="text-red-500">{errors.description}</p>
          ) : (
            <span>Mínimo 20 caracteres</span>
          )}
          <span>{(data.description ?? "").length}/500</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">
          Intereses de participación
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PARTICIPATION_OPTIONS.map((option) => (
            <CheckboxCard
              key={option.value}
              label={option.label}
              description={option.description}
              checked={(data.interests ?? []).includes(option.value)}
              onChange={() => toggleInterest(option.value)}
            />
          ))}
        </div>
        {errors.interests && (
          <p className="text-sm text-red-500">{errors.interests}</p>
        )}
      </div>
    </div>
  );
}
