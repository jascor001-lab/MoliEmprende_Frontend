"use client";

import { motion } from "framer-motion";
import { Hand } from "lucide-react";
import { InputField, TextAreaField, SectionHeader, SelectField } from "@/components/ui/FormFields";
import { RadioCardGroup, CheckboxCard } from "@/components/ui/RadioCardGroup";
import { LogoUploadSection } from "@/components/form/steps/LogoUploadSection";
import { ArtesanalInfoSection } from "@/components/form/steps/ArtesanalInfoSection";
import {
  BUSINESS_SECTOR_OPTIONS,
  HOUSING_TYPE_OPTIONS,
  RUC_PROCESS_STAGE_OPTIONS,
  LOGISTICS_OPTIONS,
  YES_NO_OPTIONS,
  type Step2Data,
  type LogisticItem,
} from "@/types/form";

interface Step2ArtesanoIndependienteProps {
  data: Step2Data;
  errors: Partial<Record<keyof Step2Data, string>>;
  onChange: (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => void;
}

export function Step2ArtesanoIndependiente({
  data,
  errors,
  onChange,
}: Step2ArtesanoIndependienteProps) {
  const toggleLogistic = (item: LogisticItem) => {
    const current = data.logisticsItems ?? [];
    if (current.includes(item)) {
      onChange("logisticsItems", current.filter((i) => i !== item));
    } else {
      onChange("logisticsItems", [...current, item]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl bg-molina/5 p-4">
        <Hand className="mt-0.5 h-6 w-6 shrink-0 text-molina" />
        <div>
          <h3 className="font-semibold text-molina-dark">Artesano independiente</h3>
          <p className="mt-1 text-sm text-slate-600">
            Produce y vende de forma artesanal sin RUC, o en proceso de formalización
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeader title="Datos Personales" />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="fullName"
            label="Nombre Completo"
            value={data.fullName}
            onChange={(v) => onChange("fullName", v)}
            error={errors.fullName}
            placeholder="Juan Pérez García"
            required
          />
          <InputField
            id="dni"
            label="DNI"
            value={data.dni ?? ""}
            onChange={(v) => onChange("dni", v.replace(/\D/g, "").slice(0, 8))}
            error={errors.dni}
            placeholder="12345678"
            maxLength={8}
            required
          />
        </div>

        <InputField
          id="direccionParticular"
          label="Dirección Particular"
          value={data.direccionParticular ?? ""}
          onChange={(v) => onChange("direccionParticular", v)}
          error={errors.direccionParticular}
          placeholder="Av. Principal 123, La Molina"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="phone"
            label="Celular"
            value={data.phone}
            onChange={(v) => onChange("phone", v.replace(/\D/g, "").slice(0, 11))}
            error={errors.phone}
            placeholder="987654321"
            type="tel"
            required
          />
          <InputField
            id="email"
            label="Correo Electrónico"
            value={data.email}
            onChange={(v) => onChange("email", v)}
            error={errors.email}
            placeholder="correo@ejemplo.com"
            type="email"
            required
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Tipo de vivienda (si es familiar detalle el parentesco)
            <span className="text-red-500"> *</span>
          </p>
          <RadioCardGroup
            options={HOUSING_TYPE_OPTIONS}
            value={data.housingType}
            onChange={(v) => onChange("housingType", v)}
            columns={2}
            size="sm"
          />
          {errors.housingType && (
            <p className="text-sm text-red-500">{errors.housingType}</p>
          )}
        </div>

        {(data.housingType === "familiar" || data.housingType === "otro") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <InputField
              id="housingDetail"
              label={
                data.housingType === "familiar"
                  ? "Detalle el parentesco"
                  : "Detalle el tipo de vivienda"
              }
              value={data.housingDetail ?? ""}
              onChange={(v) => onChange("housingDetail", v)}
              error={errors.housingDetail}
              placeholder={
                data.housingType === "familiar" ? "Ej: Hijo/a, padre/madre..." : "Especifique..."
              }
              required
            />
          </motion.div>
        )}
      </div>

      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader title="Datos de tu Actividad Artesanal" />

        <InputField
          id="businessName"
          label="Nombre de tu Taller / Marca Artesanal"
          value={data.businessName ?? ""}
          onChange={(v) => onChange("businessName", v)}
          error={errors.businessName}
          placeholder="Mi Taller Artesanal"
          required
        />

        <LogoUploadSection
          data={data}
          errors={errors}
          onChange={onChange}
          label="Logo del taller / marca artesanal"
        />

        <SelectField
          id="businessSector"
          label="Rubro Principal"
          value={data.businessSector ?? ""}
          onChange={(v) => onChange("businessSector", v)}
          options={BUSINESS_SECTOR_OPTIONS}
          error={errors.businessSector}
          placeholder="Selecciona tu rubro principal"
          required
        />

        <TextAreaField
          id="businessDescription"
          label="Breve Descripción de tus Productos Artesanales"
          value={data.businessDescription ?? ""}
          onChange={(v) => onChange("businessDescription", v)}
          error={errors.businessDescription}
          placeholder="Describe brevemente lo que elaboras y ofreces..."
          maxLength={500}
          rows={4}
          required
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            ¿Has participado en otras exposiciones de artesanos o emprendedores?
            <span className="text-red-500"> *</span>
          </p>
          <RadioCardGroup
            options={YES_NO_OPTIONS}
            value={data.participatedInExpositions}
            onChange={(v) => onChange("participatedInExpositions", v)}
            columns={2}
            size="sm"
          />
          {errors.participatedInExpositions && (
            <p className="text-sm text-red-500">{errors.participatedInExpositions}</p>
          )}
        </div>
      </div>

      <ArtesanalInfoSection data={data} errors={errors} onChange={onChange} />

      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader title="Situación de tu Actividad Artesanal" />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            ¿Has iniciado el trámite de RUC?<span className="text-red-500"> *</span>
          </p>
          <RadioCardGroup
            options={YES_NO_OPTIONS}
            value={data.rucProcessStarted}
            onChange={(v) => onChange("rucProcessStarted", v)}
            columns={2}
            size="sm"
          />
          {errors.rucProcessStarted && (
            <p className="text-sm text-red-500">{errors.rucProcessStarted}</p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            ¿En qué etapa se encuentra?<span className="text-red-500"> *</span>
          </p>
          <RadioCardGroup
            options={RUC_PROCESS_STAGE_OPTIONS}
            value={data.rucProcessStage}
            onChange={(v) => onChange("rucProcessStage", v)}
            columns={1}
            size="sm"
          />
          {errors.rucProcessStage && (
            <p className="text-sm text-red-500">{errors.rucProcessStage}</p>
          )}
        </div>

        {data.rucProcessStage === "otro" && (
          <InputField
            id="rucProcessStageOther"
            label="Especifique la etapa"
            value={data.rucProcessStageOther ?? ""}
            onChange={(v) => onChange("rucProcessStageOther", v)}
            error={errors.rucProcessStageOther}
            placeholder="Detalle la etapa..."
            required
          />
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            ¿Necesitas ayuda para formalizar tu actividad artesanal?
            <span className="text-red-500"> *</span>
          </p>
          <RadioCardGroup
            options={YES_NO_OPTIONS}
            value={data.needsFormalizationHelp}
            onChange={(v) => onChange("needsFormalizationHelp", v)}
            columns={2}
            size="sm"
          />
          {errors.needsFormalizationHelp && (
            <p className="text-sm text-red-500">{errors.needsFormalizationHelp}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader title="Logística" />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            ¿Necesitas un espacio de exhibición?<span className="text-red-500"> *</span>
          </p>
          <RadioCardGroup
            options={YES_NO_OPTIONS}
            value={data.needsExhibitionSpace}
            onChange={(v) => onChange("needsExhibitionSpace", v)}
            columns={2}
            size="sm"
          />
          {errors.needsExhibitionSpace && (
            <p className="text-sm text-red-500">{errors.needsExhibitionSpace}</p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Cuentas con...<span className="text-red-500"> *</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {LOGISTICS_OPTIONS.map((option) => (
              <CheckboxCard
                key={option.value}
                label={option.label}
                checked={(data.logisticsItems ?? []).includes(option.value)}
                onChange={() => toggleLogistic(option.value)}
              />
            ))}
          </div>
          {errors.logisticsItems && (
            <p className="text-sm text-red-500">{errors.logisticsItems}</p>
          )}
        </div>

        {(data.logisticsItems ?? []).includes("otro") && (
          <InputField
            id="logisticsOther"
            label="Detalle otro elemento de logística"
            value={data.logisticsOther ?? ""}
            onChange={(v) => onChange("logisticsOther", v)}
            error={errors.logisticsOther}
            placeholder="Especifique..."
            required
          />
        )}
      </div>
    </div>
  );
}
