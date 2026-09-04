"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { InputField, TextAreaField, SectionHeader } from "@/components/ui/FormFields";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { YES_NO_OPTIONS, type Step2Data } from "@/types/form";

interface Step2EmprendedorPotencialProps {
  data: Step2Data;
  errors: Partial<Record<keyof Step2Data, string>>;
  onChange: (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => void;
}

export function Step2EmprendedorPotencial({
  data,
  errors,
  onChange,
}: Step2EmprendedorPotencialProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl bg-molina/5 p-4">
        <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-molina" />
        <div>
          <h3 className="font-semibold text-molina-dark">Emprendedor Potencial</h3>
          <p className="mt-1 text-sm text-slate-600">
            Personas con idea de negocio en desarrollo
          </p>
        </div>
      </div>

      {/* Datos personales */}
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
      </div>

      {/* Tu idea de negocio */}
      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader
          title="Tu Idea de Negocio"
          subtitle="Cuéntanos sobre la idea que quieres desarrollar"
        />

        <InputField
          id="businessIdeaName"
          label="Nombre de tu Idea de Negocio"
          value={data.businessIdeaName ?? ""}
          onChange={(v) => onChange("businessIdeaName", v)}
          placeholder="Ej: EcoBolsas Molina"
        />

        <TextAreaField
          id="businessIdeaDescription"
          label="Descripción detallada de tu producto o servicio"
          value={data.businessIdeaDescription ?? ""}
          onChange={(v) => onChange("businessIdeaDescription", v)}
          error={errors.businessIdeaDescription}
          placeholder="Describe en detalle tu producto o servicio, qué problema resuelve y cómo lo ofreces..."
          maxLength={800}
          rows={5}
          required
        />

        <TextAreaField
          id="targetAudience"
          label="¿A quién va dirigido tu producto o servicio? (Público objetivo)"
          value={data.targetAudience ?? ""}
          onChange={(v) => onChange("targetAudience", v)}
          error={errors.targetAudience}
          placeholder="Ej: Familias de La Molina interesadas en productos eco-friendly..."
          maxLength={300}
          rows={3}
          required
        />

        <TextAreaField
          id="motivation"
          label="¿Qué te motivó a tener esta idea?"
          value={data.motivation ?? ""}
          onChange={(v) => onChange("motivation", v)}
          placeholder="Comparte lo que inspiró tu idea de negocio..."
          maxLength={500}
          rows={3}
        />

        <TextAreaField
          id="requiredResources"
          label="¿Qué recursos necesitas para poner en marcha tu negocio? (financieros, materiales, etc.)"
          value={data.requiredResources ?? ""}
          onChange={(v) => onChange("requiredResources", v)}
          placeholder="Ej: Capital inicial, materia prima, espacio de trabajo, capacitación..."
          maxLength={500}
          rows={3}
        />
      </div>

      {/* Asociación */}
      <div className="space-y-4">
        <SectionHeader
          title="Asociación o Agrupación"
          subtitle="Pertenece a una asociación y/o agrupación orientada al desarrollo de actividades económicas o productivas"
        />

        <RadioCardGroup
          options={YES_NO_OPTIONS}
          value={data.belongsToAssociation}
          onChange={(v) => onChange("belongsToAssociation", v)}
          columns={2}
          size="sm"
        />
        {errors.belongsToAssociation && (
          <p className="text-sm text-red-500">{errors.belongsToAssociation}</p>
        )}

        {data.belongsToAssociation === "si" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <TextAreaField
              id="associationDetail"
              label="Detalle la asociación y/o agrupación a la que pertenece"
              value={data.associationDetail ?? ""}
              onChange={(v) => onChange("associationDetail", v)}
              error={errors.associationDetail}
              placeholder="Nombre de la asociación, actividades que realizan..."
              maxLength={300}
              rows={3}
              required
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
