"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { YES_NO_OPTIONS, type Step3Data, type YesNo } from "@/types/form";

interface Step3CommitmentsProps {
  data: Step3Data;
  errors: Partial<Record<keyof Step3Data, string>>;
  onChange: (field: keyof Step3Data, value: Step3Data[keyof Step3Data]) => void;
}

const COMMITMENT_QUESTIONS: {
  field: keyof Step3Data;
  label: string;
  required: boolean;
}[] = [
  {
    field: "willingToParticipate",
    label:
      "¿Estás dispuesto a participar activamente en los eventos de MoliEmprende (capacitaciones, talleres, exposiciones y otras actividades)?",
    required: true,
  },
  {
    field: "wantToConnect",
    label: "¿Te gustaría conectar con otros emprendedores?",
    required: true,
  },
  {
    field: "acceptsTerms",
    label: "Acepto las bases y condiciones de las actividades de MoliEmprende.",
    required: true,
  },
  {
    field: "authorizesDataUse",
    label:
      "Autorizo el uso de mis datos para fines de comunicación y promoción de las actividades MoliEmprende.",
    required: true,
  },
];

export function Step3Commitments({ data, errors, onChange }: Step3CommitmentsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl bg-molina/5 p-4">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-molina" />
        <div>
          <h3 className="font-semibold text-molina-dark">Compromisos</h3>
          <p className="mt-1 text-sm text-slate-600">
            Confirma tu participación y aceptación de las condiciones del programa
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {COMMITMENT_QUESTIONS.map(({ field, label, required }) => (
          <div
            key={field}
            className="space-y-3 rounded-xl border border-slate-200/80 bg-white/60 p-4"
          >
            <p className="text-sm font-medium text-slate-700">
              {label}
              {required && <span className="text-red-500"> *</span>}
            </p>
            <RadioCardGroup
              options={YES_NO_OPTIONS}
              value={data[field] as YesNo | undefined}
              onChange={(v) => onChange(field, v)}
              columns={2}
              size="sm"
            />
            {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Los campos marcados con * son obligatorios. Para completar el registro debes aceptar
        las bases y condiciones y autorizar el uso de tus datos.
      </p>
    </div>
  );
}
