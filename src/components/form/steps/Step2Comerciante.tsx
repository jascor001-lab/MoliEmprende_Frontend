"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { InputField, TextAreaField, SectionHeader, SelectField } from "@/components/ui/FormFields";
import { RadioCardGroup, CheckboxCard } from "@/components/ui/RadioCardGroup";
import { LogoUploadSection } from "@/components/form/steps/LogoUploadSection";
import {
  BUSINESS_SECTOR_OPTIONS,
  STORE_TYPE_OPTIONS,
  SOCIAL_PLATFORM_OPTIONS,
  LOGISTICS_OPTIONS,
  YES_NO_OPTIONS,
  type Step2Data,
  type LogisticItem,
  type SocialPlatform,
} from "@/types/form";

interface Step2ComercianteProps {
  data: Step2Data;
  errors: Partial<Record<keyof Step2Data, string>>;
  onChange: (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => void;
}

export function Step2Comerciante({ data, errors, onChange }: Step2ComercianteProps) {
  const toggleLogistic = (item: LogisticItem) => {
    const current = data.logisticsItems ?? [];
    if (current.includes(item)) {
      onChange("logisticsItems", current.filter((i) => i !== item));
    } else {
      onChange("logisticsItems", [...current, item]);
    }
  };

  const toggleSocialPlatform = (platform: SocialPlatform) => {
    const current = data.socialPlatforms ?? [];
    if (current.includes(platform)) {
      onChange("socialPlatforms", current.filter((p) => p !== platform));
    } else {
      onChange("socialPlatforms", [...current, platform]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl bg-molina/5 p-4">
        <Briefcase className="mt-0.5 h-6 w-6 shrink-0 text-molina" />
        <div>
          <h3 className="font-semibold text-molina-dark">
            Emprendedor con RUC 10 — Persona Natural
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Persona con negocio que ya cuenta con experiencia en ventas de producto
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
          id="ruc"
          label="RUC"
          value={data.ruc ?? ""}
          onChange={(v) => onChange("ruc", v.replace(/\D/g, "").slice(0, 11))}
          error={errors.ruc}
          placeholder="10123456789"
          maxLength={11}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="direccionParticular"
            label="Dirección Particular"
            value={data.direccionParticular ?? ""}
            onChange={(v) => onChange("direccionParticular", v)}
            error={errors.direccionParticular}
            placeholder="Av. Principal 123, La Molina"
            required
          />
          <InputField
            id="direccionComercial"
            label="Dirección Comercial"
            value={data.direccionComercial ?? ""}
            onChange={(v) => onChange("direccionComercial", v)}
            error={errors.direccionComercial}
            placeholder="Local comercial en La Molina"
            required
          />
        </div>

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

      {/* Datos del negocio */}
      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader title="Datos de tu Negocio" />

        <InputField
          id="businessName"
          label="Nombre de tu Negocio"
          value={data.businessName ?? ""}
          onChange={(v) => onChange("businessName", v)}
          error={errors.businessName}
          placeholder="Mi Negocio"
          required
        />

        <LogoUploadSection
          data={data}
          errors={errors}
          onChange={onChange}
          label="Logo del negocio"
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
          label="Descripción detallada de tu producto o servicio"
          value={data.businessDescription ?? ""}
          onChange={(v) => onChange("businessDescription", v)}
          error={errors.businessDescription}
          placeholder="Describe en detalle los productos o servicios que ofrece tu negocio..."
          maxLength={800}
          rows={5}
          required
        />

        <InputField
          id="website"
          label="Página web (si tiene)"
          value={data.website ?? ""}
          onChange={(v) => onChange("website", v)}
          error={errors.website}
          placeholder="https://tunegocio.com"
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Redes Sociales</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SOCIAL_PLATFORM_OPTIONS.map((platform) => (
              <CheckboxCard
                key={platform.value}
                label={platform.label}
                checked={(data.socialPlatforms ?? []).includes(platform.value)}
                onChange={() => toggleSocialPlatform(platform.value)}
              />
            ))}
          </div>
        </div>

        <TextAreaField
          id="socialNetworksDetail"
          label="Colocar sus redes sociales"
          value={data.socialNetworksDetail ?? ""}
          onChange={(v) => onChange("socialNetworksDetail", v)}
          placeholder="Ej: @mi_negocio en Instagram, facebook.com/minegocio..."
          maxLength={500}
          rows={3}
        />

        <InputField
          id="businessOperatingTime"
          label="¿Cuánto tiempo lleva funcionando tu negocio?"
          value={data.businessOperatingTime ?? ""}
          onChange={(v) => onChange("businessOperatingTime", v)}
          error={errors.businessOperatingTime}
          placeholder="Ej: 2 años, 6 meses..."
          required
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            ¿Tienes tienda física o vendes solo online?
            <span className="text-red-500"> *</span>
          </p>
          <RadioCardGroup
            options={STORE_TYPE_OPTIONS}
            value={data.storeType}
            onChange={(v) => onChange("storeType", v)}
            columns={2}
            size="sm"
          />
          {errors.storeType && <p className="text-sm text-red-500">{errors.storeType}</p>}
        </div>

        <TextAreaField
          id="digitalPlatforms"
          label="¿En qué plataformas digitales vendes tus productos o servicios?"
          value={data.digitalPlatforms ?? ""}
          onChange={(v) => onChange("digitalPlatforms", v)}
          error={errors.digitalPlatforms}
          placeholder="Ej: Instagram, Facebook Marketplace, Mercado Libre, WhatsApp Business..."
          maxLength={400}
          rows={3}
          required
        />
      </div>

      {/* Logística */}
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

      {/* Experiencia en ventas */}
      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader title="Experiencia en Ventas" />

        <TextAreaField
          id="mainSalesChannel"
          label="¿Cuál es tu canal de venta principal? (Tiendas físicas, exposiciones, online, etc.)"
          value={data.mainSalesChannel ?? ""}
          onChange={(v) => onChange("mainSalesChannel", v)}
          error={errors.mainSalesChannel}
          placeholder="Ej: Venta directa en ferias, tienda física, redes sociales..."
          maxLength={400}
          rows={3}
          required
        />

        <TextAreaField
          id="digitalMarketingExperience"
          label="¿Cuál es tu experiencia en marketing digital?"
          value={data.digitalMarketingExperience ?? ""}
          onChange={(v) => onChange("digitalMarketingExperience", v)}
          placeholder="Describe tu experiencia con redes sociales, publicidad digital, etc."
          maxLength={400}
          rows={3}
        />

        <TextAreaField
          id="participatedBusinessEvents"
          label="¿Has participado en otras exposiciones o eventos empresariales?"
          value={data.participatedBusinessEvents ?? ""}
          onChange={(v) => onChange("participatedBusinessEvents", v)}
          placeholder="Menciona ferias, eventos o exposiciones en las que has participado..."
          maxLength={400}
          rows={3}
        />
      </div>

      {/* Motivación */}
      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader
          title="Motivación para participar en MoliEmprende"
          subtitle="Cuéntanos qué esperas del programa"
        />

        <TextAreaField
          id="participationExpectations"
          label="¿Qué esperas obtener al participar de las actividades de MoliEmprende?"
          value={data.participationExpectations ?? ""}
          onChange={(v) => onChange("participationExpectations", v)}
          placeholder="Ej: Capacitación, networking, visibilidad..."
          maxLength={400}
          rows={3}
        />

        <TextAreaField
          id="participationBenefits"
          label="¿Qué beneficios crees que te aportará?"
          value={data.participationBenefits ?? ""}
          onChange={(v) => onChange("participationBenefits", v)}
          placeholder="Describe los beneficios que esperas recibir..."
          maxLength={400}
          rows={3}
        />
      </div>
    </div>
  );
}
