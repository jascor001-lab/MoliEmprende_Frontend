"use client";

import { motion } from "framer-motion";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { InputField, SelectField } from "@/components/ui/FormFields";
import {
  BUSINESS_SECTOR_OPTIONS,
  ARTESANAL_LINE_OPTIONS,
  LICENCIA_OPTIONS,
  RNA_STATUS_OPTIONS,
  requiresRucFields,
  isArtesanoGroup,
  type Step1Data,
  type Step2Data,
} from "@/types/form";

interface Step2DetailsProps {
  step1: Step1Data;
  data: Step2Data;
  errors: Partial<Record<keyof Step2Data, string>>;
  onChange: (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => void;
}

export function Step2Details({ step1, data, errors, onChange }: Step2DetailsProps) {
  const needsRuc = requiresRucFields(step1.mainGroup, step1.subClassification);
  const isArtesano = isArtesanoGroup(step1.mainGroup);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-molina-dark">Datos de Contacto y Negocio</h3>
        <p className="mt-1 text-sm text-slate-600">
          Completa la información según tu clasificación seleccionada.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="fullName"
          label="Nombre completo"
          value={data.fullName}
          onChange={(v) => onChange("fullName", v)}
          error={errors.fullName}
          placeholder="Juan Pérez García"
          required
        />
        <InputField
          id="phone"
          label="Teléfono / WhatsApp"
          value={data.phone}
          onChange={(v) => onChange("phone", v.replace(/\D/g, "").slice(0, 11))}
          error={errors.phone}
          placeholder="987654321"
          type="tel"
          required
        />
      </div>

      <InputField
        id="email"
        label="Correo electrónico"
        value={data.email}
        onChange={(v) => onChange("email", v)}
        error={errors.email}
        placeholder="correo@ejemplo.com"
        type="email"
        required
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

      {needsRuc && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5"
        >
          <h4 className="font-semibold text-molina-dark">Datos de Formalización (RUC)</h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              id="ruc"
              label="Número de RUC"
              value={data.ruc ?? ""}
              onChange={(v) => onChange("ruc", v.replace(/\D/g, "").slice(0, 11))}
              error={errors.ruc}
              placeholder="20123456789"
              maxLength={11}
              required
            />
            <InputField
              id="razonSocial"
              label="Razón Social / Nombre Comercial"
              value={data.razonSocial ?? ""}
              onChange={(v) => onChange("razonSocial", v)}
              error={errors.razonSocial}
              placeholder="Mi Negocio S.A.C."
              required
            />
          </div>

          <InputField
            id="direccionLocal"
            label="Dirección del Local / Taller en La Molina"
            value={data.direccionLocal ?? ""}
            onChange={(v) => onChange("direccionLocal", v)}
            error={errors.direccionLocal}
            placeholder="Av. Principal 123, La Molina"
            required
          />

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">
              ¿Cuenta con Licencia de Funcionamiento municipal?
            </p>
            <RadioCardGroup
              options={LICENCIA_OPTIONS}
              value={data.licenciaFuncionamiento}
              onChange={(v) => onChange("licenciaFuncionamiento", v)}
              columns={3}
              size="sm"
            />
            {errors.licenciaFuncionamiento && (
              <p className="text-sm text-red-500">{errors.licenciaFuncionamiento}</p>
            )}
          </div>
        </motion.div>
      )}

      {isArtesano && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5"
        >
          <h4 className="font-semibold text-molina-dark">Información Artesanal</h4>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Línea artesanal principal</p>
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
            </p>
            <RadioCardGroup
              options={RNA_STATUS_OPTIONS}
              value={data.rnaStatus}
              onChange={(v) => onChange("rnaStatus", v)}
              columns={3}
              size="sm"
            />
            {errors.rnaStatus && (
              <p className="text-sm text-red-500">{errors.rnaStatus}</p>
            )}
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
        </motion.div>
      )}
    </div>
  );
}
