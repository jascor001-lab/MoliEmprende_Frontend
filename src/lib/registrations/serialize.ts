import type { MoliEmprendeFormData } from "@/types/form";
import type { RegistrationRecord } from "./types";

function joinList(values?: string[]): string {
  return values?.length ? values.join("; ") : "";
}

function str(value?: string | null): string {
  return value?.toString().trim() ?? "";
}

/** Convierte el formulario del wizard en un registro plano (sin archivos binarios). */
export function formDataToRegistration(
  form: MoliEmprendeFormData,
  existingId?: string
): RegistrationRecord {
  const now = new Date().toISOString();
  const dni = str(form.step0.dni) || str(form.step2.dni);

  return {
    id: existingId ?? crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    dni,
    mainGroup: form.step1.mainGroup,
    subClassification: form.step1.subClassification,
    fullName: str(form.step2.fullName),
    phone: str(form.step2.phone),
    email: str(form.step2.email),
    dniFileName: form.step0.dniFile?.name ?? null,
    hasLogo: form.step2.hasLogo,
    logoFileName: form.step2.logoFile?.name ?? null,
    direccionParticular: str(form.step2.direccionParticular),
    direccionComercial: str(form.step2.direccionComercial),
    direccionLocal: str(form.step2.direccionLocal),
    housingType: form.step2.housingType,
    housingDetail: str(form.step2.housingDetail),
    ruc: str(form.step2.ruc),
    razonSocial: str(form.step2.razonSocial),
    licenciaFuncionamiento: form.step2.licenciaFuncionamiento,
    legalRepPosition: str(form.step2.legalRepPosition),
    legalRepPhone: str(form.step2.legalRepPhone),
    legalRepEmail: str(form.step2.legalRepEmail),
    businessSector: str(form.step2.businessSector),
    businessName: str(form.step2.businessName),
    businessIdeaName: str(form.step2.businessIdeaName),
    businessDescription: str(form.step2.businessDescription),
    businessIdeaDescription: str(form.step2.businessIdeaDescription),
    targetAudience: str(form.step2.targetAudience),
    motivation: str(form.step2.motivation),
    requiredResources: str(form.step2.requiredResources),
    belongsToAssociation: form.step2.belongsToAssociation,
    associationDetail: str(form.step2.associationDetail),
    businessOperatingTime: str(form.step2.businessOperatingTime),
    storeType: form.step2.storeType,
    digitalPlatforms: str(form.step2.digitalPlatforms),
    mainSalesChannel: str(form.step2.mainSalesChannel),
    digitalMarketingExperience: str(form.step2.digitalMarketingExperience),
    participatedBusinessEvents: str(form.step2.participatedBusinessEvents),
    mainProductsServices: str(form.step2.mainProductsServices),
    targetMarket: form.step2.targetMarket,
    companySize: str(form.step2.companySize),
    yearsMarketExperience: str(form.step2.yearsMarketExperience),
    mainCompanyChallenges: str(form.step2.mainCompanyChallenges),
    participatedInExpositions: form.step2.participatedInExpositions,
    rucProcessStarted: form.step2.rucProcessStarted,
    rucProcessStage: form.step2.rucProcessStage,
    rucProcessStageOther: str(form.step2.rucProcessStageOther),
    needsFormalizationHelp: form.step2.needsFormalizationHelp,
    needsExhibitionSpace: form.step2.needsExhibitionSpace,
    logisticsItems: joinList(form.step2.logisticsItems),
    logisticsOther: str(form.step2.logisticsOther),
    website: str(form.step2.website),
    socialPlatforms: joinList(form.step2.socialPlatforms),
    socialNetworksDetail: str(form.step2.socialNetworksDetail),
    lineaArtesanal: form.step2.lineaArtesanal,
    rnaStatus: form.step2.rnaStatus,
    rnaNumber: str(form.step2.rnaNumber),
    instagram: str(form.step3.instagram),
    facebook: str(form.step3.facebook),
    tiktok: str(form.step3.tiktok),
    websiteStep3: str(form.step3.website),
    description: str(form.step3.description),
    interests: joinList(form.step3.interests),
    willingToParticipate: form.step3.willingToParticipate,
    wantToConnect: form.step3.wantToConnect,
    acceptsTerms: form.step3.acceptsTerms,
    authorizesDataUse: form.step3.authorizesDataUse,
    participationExpectations: str(form.step2.participationExpectations),
    participationBenefits: str(form.step2.participationBenefits),
  };
}

/**
 * Une registros por DNI: una fila por persona.
 * Campos vacíos se rellenan con valores no vacíos de registros anteriores;
 * en conflicto gana el más reciente.
 */
export function mergeRegistrationsByDni(
  records: RegistrationRecord[]
): RegistrationRecord[] {
  const byDni = new Map<string, RegistrationRecord>();

  const sorted = [...records].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );

  for (const record of sorted) {
    const key = record.dni.trim();
    if (!key) continue;

    const prev = byDni.get(key);
    if (!prev) {
      byDni.set(key, { ...record });
      continue;
    }

    const merged: RegistrationRecord = { ...prev };
    for (const [field, value] of Object.entries(record) as [
      keyof RegistrationRecord,
      RegistrationRecord[keyof RegistrationRecord],
    ][]) {
      if (field === "id") continue;
      if (field === "createdAt") {
        merged.createdAt =
          new Date(prev.createdAt) <= new Date(record.createdAt)
            ? prev.createdAt
            : record.createdAt;
        continue;
      }
      if (field === "updatedAt") {
        merged.updatedAt = record.updatedAt;
        continue;
      }
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        (merged as unknown as Record<string, unknown>)[field] = value;
      }
    }
    byDni.set(key, merged);
  }

  return Array.from(byDni.values()).sort((a, b) =>
    a.dni.localeCompare(b.dni, "es", { numeric: true })
  );
}
