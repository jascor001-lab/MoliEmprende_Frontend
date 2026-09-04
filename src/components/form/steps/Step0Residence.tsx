"use client";

import { motion } from "framer-motion";
import { ShieldCheck, MapPin } from "lucide-react";
import { FileDropzone } from "@/components/ui/FileDropzone";
import type { Step0Data } from "@/types/form";

interface Step0ResidenceProps {
  data: Step0Data;
  errors: Partial<Record<keyof Step0Data, string>>;
  onChange: (field: keyof Step0Data, value: Step0Data[keyof Step0Data]) => void;
}

export function Step0Residence({ data, errors, onChange }: Step0ResidenceProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl bg-molina/5 p-4">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-molina" />
        <div>
          <h3 className="font-semibold text-molina-dark">Verificación de Residencia</h3>
          <p className="mt-1 text-sm text-slate-600">
            MoliEmprende es un programa exclusivo para vecinos del distrito de La Molina.
            Verifica tu residencia para continuar.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="dni" className="block text-sm font-medium text-slate-700">
          Número de DNI
        </label>
        <input
          id="dni"
          type="text"
          inputMode="numeric"
          maxLength={8}
          placeholder="12345678"
          value={data.dni}
          onChange={(e) => onChange("dni", e.target.value.replace(/\D/g, "").slice(0, 8))}
          className={`w-full rounded-xl border-2 bg-white/80 px-4 py-3 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-molina/30 ${
            errors.dni ? "border-red-400" : "border-slate-200 focus:border-molina"
          }`}
        />
        {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Adjunto de DNI (PDF o Imagen)
        </label>
        <FileDropzone
          value={data.dniFile}
          onChange={(file) => onChange("dniFile", file)}
          error={errors.dniFile}
        />
      </div>

      <div
        className={`rounded-xl border-2 p-4 transition-colors ${
          errors.isLaMolinaResident
            ? "border-red-300 bg-red-50/50"
            : "border-slate-200 bg-white/60"
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isLaMolinaResident}
            onChange={(e) => onChange("isLaMolinaResident", e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-molina focus:ring-molina"
          />
          <div>
            <span className="font-medium text-slate-700">
              Confirmo que mi domicilio pertenece al distrito de La Molina
            </span>
            <p className="mt-1 text-sm text-slate-500">
              Según DNI o residencia actual en el distrito de La Molina, Lima.
            </p>
          </div>
        </label>
        {errors.isLaMolinaResident && (
          <p className="mt-2 text-sm text-red-500">{errors.isLaMolinaResident}</p>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        <MapPin className="h-3.5 w-3.5" />
        <span>Datos protegidos según normativa de protección de datos personales</span>
      </div>
    </div>
  );
}
