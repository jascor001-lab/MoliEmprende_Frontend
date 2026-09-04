"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { InputField, TextAreaField, SectionHeader } from "@/components/ui/FormFields";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import { ArtesanalInfoSection } from "@/components/form/steps/ArtesanalInfoSection";
import { YES_NO_OPTIONS, type Step2Data } from "@/types/form";

interface Step2ArtesanoPotencialProps {
  data: Step2Data;
  errors: Partial<Record<keyof Step2Data, string>>;
  onChange: (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => void;
}

export function Step2ArtesanoPotencial({
  data,
  errors,
  onChange,
}: Step2ArtesanoPotencialProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl bg-molina/5 p-4">
        <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-molina" />
        <div>
          <h3 className="font-semibold text-molina-dark">Artesano potencial / Aprendiz</h3>
          <p className="mt-1 text-sm text-slate-600">
            En formación o fase inicial de creación artesanal
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
      </div>

      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader
          title="Tu Idea Artesanal"
          subtitle="Cuéntanos sobre la creación o taller que quieres desarrollar"
        />

        <InputField
          id="businessIdeaName"
          label="Nombre de tu Idea Artesanal"
          value={data.businessIdeaName ?? ""}
          onChange={(v) => onChange("businessIdeaName", v)}
          placeholder="Ej: Tejidos Andinos Molina"
        />

        <TextAreaField
          id="businessIdeaDescription"
          label="Descripción detallada de tu producto o técnica artesanal"
          value={data.businessIdeaDescription ?? ""}
          onChange={(v) => onChange("businessIdeaDescription", v)}
          error={errors.businessIdeaDescription}
          placeholder="Describe tu producto artesanal, técnica, materiales y proceso de creación..."
          maxLength={800}
          rows={5}
          required
        />

        <TextAreaField
          id="targetAudience"
          label="¿A quién va dirigido tu producto artesanal? (Público objetivo)"
          value={data.targetAudience ?? ""}
          onChange={(v) => onChange("targetAudience", v)}
          error={errors.targetAudience}
          placeholder="Ej: Familias interesadas en productos hechos a mano..."
          maxLength={300}
          rows={3}
          required
        />

        <TextAreaField
          id="motivation"
          label="¿Qué te motivó a iniciar esta práctica artesanal?"
          value={data.motivation ?? ""}
          onChange={(v) => onChange("motivation", v)}
          placeholder="Comparte lo que inspiró tu camino artesanal..."
          maxLength={500}
          rows={3}
        />

        <TextAreaField
          id="requiredResources"
          label="¿Qué recursos necesitas para desarrollar tu oficio? (materiales, herramientas, capacitación, etc.)"
          value={data.requiredResources ?? ""}
          onChange={(v) => onChange("requiredResources", v)}
          placeholder="Ej: Materia prima, herramientas, espacio de taller, capacitación..."
          maxLength={500}
          rows={3}
        />
      </div>

      <ArtesanalInfoSection data={data} errors={errors} onChange={onChange} />

      <div className="space-y-4">
        <SectionHeader
          title="Asociación o Agrupación"
          subtitle="¿Perteneces a una asociación y/o agrupación artesanal u orientada a actividades productivas?"
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
