"use client";

import { InputField, SectionHeader } from "@/components/ui/FormFields";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import {
  ARTESANAL_LINE_OPTIONS,
  RNA_STATUS_OPTIONS,
  type Step2Data,
} from "@/types/form";

interface ArtesanalInfoSectionProps {
  data: Step2Data;
  errors: Partial<Record<keyof Step2Data, string>>;
  onChange: (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => void;
}

export function ArtesanalInfoSection({
  data,
  errors,
  onChange,
}: ArtesanalInfoSectionProps) {
  return (
    <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
      <SectionHeader
        title="Información Artesanal"
        subtitle="Datos específicos de tu actividad artesanal"
      />

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">
          Línea artesanal principal<span className="text-red-500"> *</span>
        </p>
        <RadioCardGroup
          options={ARTESANAL_LINE_OPTIONS}
          value={data.lineaArtesanal}
          onChange={(v) => onChange("lineaArtesanal", v)}
          columns={2}
          size="sm"
        />
        {errors.lineaArtesanal && (
          <p className="text-sm text-red-500">{errors.lineaArtesanal}</p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">
          ¿Cuenta con Registro Nacional del Artesano (RNA)?
          <span className="text-red-500"> *</span>
        </p>
        <RadioCardGroup
          options={RNA_STATUS_OPTIONS}
          value={data.rnaStatus}
          onChange={(v) => onChange("rnaStatus", v)}
          columns={3}
          size="sm"
        />
        {errors.rnaStatus && <p className="text-sm text-red-500">{errors.rnaStatus}</p>}
      </div>

      {data.rnaStatus === "si" && (
        <InputField
          id="rnaNumber"
          label="N° de Registro RNA"
          value={data.rnaNumber ?? ""}
          onChange={(v) => onChange("rnaNumber", v)}
          error={errors.rnaNumber}
          placeholder="RNA-2024-00123"
          required
        />
      )}
    </div>
  );
}
