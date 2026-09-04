"use client";

import { Landmark } from "lucide-react";
import { InputField, TextAreaField, SectionHeader, SelectField } from "@/components/ui/FormFields";
import { RadioCardGroup, CheckboxCard } from "@/components/ui/RadioCardGroup";
import { ArtesanalInfoSection } from "@/components/form/steps/ArtesanalInfoSection";
import { LogoUploadSection } from "@/components/form/steps/LogoUploadSection";
import {
  BUSINESS_SECTOR_OPTIONS,
  SOCIAL_PLATFORM_OPTIONS,
  TARGET_MARKET_OPTIONS,
  LOGISTICS_OPTIONS,
  YES_NO_OPTIONS,
  type Step2Data,
  type LogisticItem,
  type SocialPlatform,
} from "@/types/form";

interface Step2ArtesanoTallerProps {
  data: Step2Data;
  errors: Partial<Record<keyof Step2Data, string>>;
  onChange: (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => void;
}

export function Step2ArtesanoTaller({ data, errors, onChange }: Step2ArtesanoTallerProps) {
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
        <Landmark className="mt-0.5 h-6 w-6 shrink-0 text-molina" />
        <div>
          <h3 className="font-semibold text-molina-dark">
            Taller o Empresa Artesanal / Asociación
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Persona Jurídica RUC 20 o Asociación artesanal establecida en La Molina
          </p>
        </div>
      </div>

      {/* Datos de la empresa / taller */}
      <div className="space-y-4">
        <SectionHeader title="Datos del Taller o Empresa Artesanal" />

        <InputField
          id="razonSocial"
          label="Razón Social"
          value={data.razonSocial ?? ""}
          onChange={(v) => onChange("razonSocial", v)}
          error={errors.razonSocial}
          placeholder="Taller Artesanal S.A.C. / Asociación..."
          required
        />

        <LogoUploadSection
          data={data}
          errors={errors}
          onChange={onChange}
          label="Logo del taller / empresa artesanal"
        />

        <InputField
          id="ruc"
          label="RUC"
          value={data.ruc ?? ""}
          onChange={(v) => onChange("ruc", v.replace(/\D/g, "").slice(0, 11))}
          error={errors.ruc}
          placeholder="20123456789"
          maxLength={11}
          required
        />

        <InputField
          id="direccionComercial"
          label="Dirección Comercial"
          value={data.direccionComercial ?? ""}
          onChange={(v) => onChange("direccionComercial", v)}
          error={errors.direccionComercial}
          placeholder="Av. Principal 123, La Molina"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="phone"
            label="Celular de contacto"
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
            placeholder="contacto@tallerartesanal.com"
            type="email"
            required
          />
        </div>

        <InputField
          id="website"
          label="Página web (si tiene)"
          value={data.website ?? ""}
          onChange={(v) => onChange("website", v)}
          error={errors.website}
          placeholder="https://tutallerartesanal.com"
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
          placeholder="Ej: @taller_artesanal en Instagram, linkedin.com/company/taller..."
          maxLength={500}
          rows={3}
        />
      </div>

      {/* Representante legal */}
      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader title="Representante Legal" />

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
          id="legalRepPosition"
          label="Cargo en el Taller / Empresa / Asociación"
          value={data.legalRepPosition ?? ""}
          onChange={(v) => onChange("legalRepPosition", v)}
          error={errors.legalRepPosition}
          placeholder="Gerente General, Presidente, Director, etc."
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="legalRepPhone"
            label="Celular"
            value={data.legalRepPhone ?? ""}
            onChange={(v) => onChange("legalRepPhone", v.replace(/\D/g, "").slice(0, 11))}
            error={errors.legalRepPhone}
            placeholder="987654321"
            type="tel"
            required
          />
          <InputField
            id="legalRepEmail"
            label="Correo electrónico"
            value={data.legalRepEmail ?? ""}
            onChange={(v) => onChange("legalRepEmail", v)}
            error={errors.legalRepEmail}
            placeholder="representante@tallerartesanal.com"
            type="email"
            required
          />
        </div>
      </div>

      {/* Descripción del taller / empresa artesanal */}
      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader title="Descripción del Taller o Empresa Artesanal" />

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
          label="Breve Descripción de tu Taller o Empresa Artesanal"
          value={data.businessDescription ?? ""}
          onChange={(v) => onChange("businessDescription", v)}
          error={errors.businessDescription}
          placeholder="Describe tu taller o empresa artesanal, su misión y actividades principales..."
          maxLength={800}
          rows={4}
          required
        />

        <TextAreaField
          id="mainProductsServices"
          label="Productos artesanales principales"
          value={data.mainProductsServices ?? ""}
          onChange={(v) => onChange("mainProductsServices", v)}
          error={errors.mainProductsServices}
          placeholder="Lista los principales productos artesanales que ofrece tu taller o empresa..."
          maxLength={500}
          rows={3}
          required
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Mercado al que se dirige<span className="text-red-500"> *</span>
          </p>
          <RadioCardGroup
            options={TARGET_MARKET_OPTIONS}
            value={data.targetMarket}
            onChange={(v) => onChange("targetMarket", v)}
            columns={3}
            size="sm"
          />
          {errors.targetMarket && (
            <p className="text-sm text-red-500">{errors.targetMarket}</p>
          )}
        </div>

        <InputField
          id="companySize"
          label="Tamaño del Taller / Empresa (Número de empleados o asociados)"
          value={data.companySize ?? ""}
          onChange={(v) => onChange("companySize", v)}
          placeholder="Ej: 5 artesanos, 10-20 asociados..."
        />
      </div>

      <ArtesanalInfoSection data={data} errors={errors} onChange={onChange} />

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

      {/* Experiencia empresarial */}
      <div className="space-y-4 rounded-xl border border-molina/20 bg-molina/5 p-5">
        <SectionHeader title="Experiencia Empresarial" />

        <InputField
          id="yearsMarketExperience"
          label="Años de Experiencia en el Mercado"
          value={data.yearsMarketExperience ?? ""}
          onChange={(v) => onChange("yearsMarketExperience", v)}
          placeholder="Ej: 3 años, 5 años..."
        />

        <TextAreaField
          id="mainCompanyChallenges"
          label="Principales desafíos que enfrenta tu Taller o Empresa Artesanal"
          value={data.mainCompanyChallenges ?? ""}
          onChange={(v) => onChange("mainCompanyChallenges", v)}
          placeholder="Describe los principales retos de tu taller o empresa artesanal..."
          maxLength={500}
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
          label="¿Qué esperas obtener al participar en este programa?"
          value={data.participationExpectations ?? ""}
          onChange={(v) => onChange("participationExpectations", v)}
          error={errors.participationExpectations}
          placeholder="Ej: Networking, visibilidad, capacitación..."
          maxLength={400}
          rows={3}
          required
        />

        <TextAreaField
          id="participationBenefits"
          label="¿Qué beneficios crees que te aportará?"
          value={data.participationBenefits ?? ""}
          onChange={(v) => onChange("participationBenefits", v)}
          error={errors.participationBenefits}
          placeholder="Describe los beneficios que esperas recibir..."
          maxLength={400}
          rows={3}
          required
        />
      </div>
    </div>
  );
}
