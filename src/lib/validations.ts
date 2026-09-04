import { z } from "zod";
import type { MainGroup, SubClassification } from "@/types/form";
import {
  isArtesanoGroup,
  isArtesanoPotencial,
  isArtesanoIndependiente,
  isArtesanoConNegocio,
  isArtesanoTallerAsociacion,
  isComerciante,
  isEmprendedorPotencial,
  isEmprendedorSinRuc,
  isNegocioRuc20,
  usesCommitmentsStep,
  requiresRucFields,
} from "@/types/form";

function requireLogoFields(
  data: {
    hasLogo?: string;
    logoFile?: File | null;
  },
  ctx: z.RefinementCtx
) {
  if (!data.hasLogo) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Indica si tienes logo o marca la opción «No tiene logo»",
      path: ["hasLogo"],
    });
    return;
  }
  if (data.hasLogo === "si") {
    if (!(data.logoFile instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debes adjuntar tu logo (imagen o PDF)",
        path: ["logoFile"],
      });
      return;
    }
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(data.logoFile.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Solo se permiten PDF o imágenes (JPG, PNG, WEBP)",
        path: ["logoFile"],
      });
    }
    if (data.logoFile.size > 5 * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El logo no debe superar 5 MB",
        path: ["logoFile"],
      });
    }
  }
}

function requireArtesanalFields(
  data: {
    lineaArtesanal?: string;
    rnaStatus?: string;
    rnaNumber?: string;
  },
  ctx: z.RefinementCtx
) {
  if (!data.lineaArtesanal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecciona tu línea artesanal principal",
      path: ["lineaArtesanal"],
    });
  }
  if (!data.rnaStatus) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Indica el estado de tu Registro Nacional del Artesano",
      path: ["rnaStatus"],
    });
  }
  if (data.rnaStatus === "si" && (!data.rnaNumber || data.rnaNumber.trim().length < 3)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ingresa el número de registro RNA",
      path: ["rnaNumber"],
    });
  }
}

// ─── Paso 0: Verificación de residencia ─────────────────────────────────────

export const step0Schema = z.object({
  dni: z
    .string()
    .min(1, "El DNI es obligatorio")
    .regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos"),
  dniFile: z
    .custom<File>((val) => val instanceof File, "Debes adjuntar tu DNI")
    .refine(
      (file) => {
        const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
        return allowed.includes(file.type);
      },
      "Solo se permiten archivos PDF o imágenes (JPG, PNG, WEBP)"
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "El archivo no debe superar 5 MB"),
  isLaMolinaResident: z.literal(true, {
    errorMap: () => ({
      message: "Debes confirmar que tu domicilio pertenece al distrito de La Molina",
    }),
  }),
});

// ─── Paso 1: Grupo de pertenencia ───────────────────────────────────────────

export const step1Schema = z.object({
  mainGroup: z.enum(["emprendedor", "artesano"], {
    required_error: "Selecciona un grupo de pertenencia",
  }),
  subClassification: z.string().min(1, "Selecciona una subclasificación"),
});

// ─── Paso 2: Datos específicos (dinámico) ───────────────────────────────────

const baseStep2Schema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre completo es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  phone: z
    .string()
    .min(1, "El celular es obligatorio")
    .regex(/^(\+51)?[9]\d{8}$|^\d{9}$/, "Ingresa un número de celular válido (9 dígitos)"),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),
  businessSector: z.string().optional(),
  dni: z.string().optional(),
  direccionParticular: z.string().optional(),
  businessIdeaName: z.string().optional(),
  businessIdeaDescription: z.string().optional(),
  targetAudience: z.string().optional(),
  motivation: z.string().optional(),
  requiredResources: z.string().optional(),
  belongsToAssociation: z.enum(["si", "no"]).optional(),
  associationDetail: z.string().optional(),
  housingType: z.enum(["propia", "alquilada", "familiar", "otro"]).optional(),
  housingDetail: z.string().optional(),
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
  hasLogo: z.enum(["si", "no"]).optional(),
  logoFile: z
    .custom<File | null>((val) => val === null || val === undefined || val instanceof File)
    .optional()
    .nullable(),
  participatedInExpositions: z.enum(["si", "no"]).optional(),
  rucProcessStarted: z.enum(["si", "no"]).optional(),
  rucProcessStage: z
    .enum(["en-proceso", "proximo-iniciar", "no-programado", "otro"])
    .optional(),
  rucProcessStageOther: z.string().optional(),
  needsFormalizationHelp: z.enum(["si", "no"]).optional(),
  needsExhibitionSpace: z.enum(["si", "no"]).optional(),
  logisticsItems: z
    .array(
      z.enum([
        "toldo-3x3",
        "toldo-2x2",
        "iluminacion",
        "banner-roll",
        "mesa-150",
        "mesa-300",
        "sillas",
        "sombrilla",
        "mesita-publicitaria",
        "colgador-prendas",
        "cable-extension",
        "cable-vulcanizado",
        "modulo-publicitario",
        "rejillas",
        "mantel-verde",
        "mostradores-joyas",
        "sin-logistica",
        "otro",
      ])
    )
    .optional(),
  logisticsOther: z.string().optional(),
  direccionComercial: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      "Ingresa una URL válida (https://...)"
    ),
  socialPlatforms: z
    .array(
      z.enum([
        "facebook",
        "instagram",
        "tiktok",
        "linkedin",
        "youtube",
        "twitter",
        "otro",
      ])
    )
    .optional(),
  socialNetworksDetail: z.string().optional(),
  businessOperatingTime: z.string().optional(),
  storeType: z.enum(["fisica", "online", "ambos"]).optional(),
  digitalPlatforms: z.string().optional(),
  mainSalesChannel: z.string().optional(),
  digitalMarketingExperience: z.string().optional(),
  participatedBusinessEvents: z.string().optional(),
  participationExpectations: z.string().optional(),
  participationBenefits: z.string().optional(),
  legalRepPosition: z.string().optional(),
  legalRepPhone: z.string().optional(),
  legalRepEmail: z.string().optional(),
  mainProductsServices: z.string().optional(),
  targetMarket: z.enum(["b2b", "b2c", "ambos"]).optional(),
  companySize: z.string().optional(),
  yearsMarketExperience: z.string().optional(),
  mainCompanyChallenges: z.string().optional(),
  ruc: z.string().optional(),
  razonSocial: z.string().optional(),
  direccionLocal: z.string().optional(),
  licenciaFuncionamiento: z.enum(["si", "en-tramite", "no"]).optional(),
  lineaArtesanal: z
    .enum([
      "textil",
      "ceramica",
      "cuero",
      "madera",
      "joyeria",
      "bisuteria",
      "manualidades",
      "otro",
    ])
    .optional(),
  rnaStatus: z.enum(["si", "no", "en-tramite"]).optional(),
  rnaNumber: z.string().optional(),
});

export function getStep2Schema(mainGroup: MainGroup, subClassification: SubClassification) {
  return baseStep2Schema.superRefine((data, ctx) => {
    if (
      isEmprendedorPotencial(mainGroup, subClassification) ||
      isArtesanoPotencial(mainGroup, subClassification)
    ) {
      if (!data.dni || !/^\d{8}$/.test(data.dni)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El DNI debe tener exactamente 8 dígitos",
          path: ["dni"],
        });
      }
      if (!data.direccionParticular || data.direccionParticular.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La dirección particular es obligatoria",
          path: ["direccionParticular"],
        });
      }
      if (
        !data.businessIdeaDescription ||
        data.businessIdeaDescription.trim().length < 20
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La descripción detallada debe tener al menos 20 caracteres",
          path: ["businessIdeaDescription"],
        });
      }
      if (!data.targetAudience || data.targetAudience.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica el público objetivo de tu producto o servicio",
          path: ["targetAudience"],
        });
      }
      if (!data.belongsToAssociation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si perteneces a una asociación o agrupación",
          path: ["belongsToAssociation"],
        });
      }
      if (
        data.belongsToAssociation === "si" &&
        (!data.associationDetail || data.associationDetail.trim().length < 3)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Detalla la asociación o agrupación a la que perteneces",
          path: ["associationDetail"],
        });
      }
      if (isArtesanoPotencial(mainGroup, subClassification)) {
        requireArtesanalFields(data, ctx);
      }
      return;
    }

    if (
      isEmprendedorSinRuc(mainGroup, subClassification) ||
      isArtesanoIndependiente(mainGroup, subClassification)
    ) {
      if (!data.dni || !/^\d{8}$/.test(data.dni)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El DNI debe tener exactamente 8 dígitos",
          path: ["dni"],
        });
      }
      if (!data.direccionParticular || data.direccionParticular.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La dirección particular es obligatoria",
          path: ["direccionParticular"],
        });
      }
      if (!data.housingType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona el tipo de vivienda",
          path: ["housingType"],
        });
      }
      if (
        (data.housingType === "familiar" || data.housingType === "otro") &&
        (!data.housingDetail || data.housingDetail.trim().length < 2)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Detalla el parentesco o tipo de vivienda",
          path: ["housingDetail"],
        });
      }
      if (!data.businessName || data.businessName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El nombre del emprendimiento es obligatorio",
          path: ["businessName"],
        });
      }
      if (!data.businessSector) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona el rubro principal",
          path: ["businessSector"],
        });
      }
      if (
        !data.businessDescription ||
        data.businessDescription.trim().length < 20
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La descripción debe tener al menos 20 caracteres",
          path: ["businessDescription"],
        });
      }
      requireLogoFields(data, ctx);
      if (!data.participatedInExpositions) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si has participado en otras exposiciones",
          path: ["participatedInExpositions"],
        });
      }
      if (!data.rucProcessStarted) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si has iniciado el trámite de RUC",
          path: ["rucProcessStarted"],
        });
      }
      if (!data.rucProcessStage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica en qué etapa se encuentra el trámite",
          path: ["rucProcessStage"],
        });
      }
      if (
        data.rucProcessStage === "otro" &&
        (!data.rucProcessStageOther || data.rucProcessStageOther.trim().length < 3)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Especifique la etapa del trámite",
          path: ["rucProcessStageOther"],
        });
      }
      if (!data.needsFormalizationHelp) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si necesitas ayuda para formalizar tu negocio",
          path: ["needsFormalizationHelp"],
        });
      }
      if (!data.needsExhibitionSpace) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si necesitas un espacio de exhibición",
          path: ["needsExhibitionSpace"],
        });
      }
      if (!data.logisticsItems || data.logisticsItems.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona al menos un elemento de logística",
          path: ["logisticsItems"],
        });
      }
      if (
        data.logisticsItems?.includes("otro") &&
        (!data.logisticsOther || data.logisticsOther.trim().length < 2)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Detalle el otro elemento de logística",
          path: ["logisticsOther"],
        });
      }
      if (isArtesanoIndependiente(mainGroup, subClassification)) {
        requireArtesanalFields(data, ctx);
      }
      return;
    }

    if (
      isComerciante(mainGroup, subClassification) ||
      isArtesanoConNegocio(mainGroup, subClassification)
    ) {
      if (!data.dni || !/^\d{8}$/.test(data.dni)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El DNI debe tener exactamente 8 dígitos",
          path: ["dni"],
        });
      }
      if (!data.ruc || !/^10\d{9}$/.test(data.ruc)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El RUC debe ser de Persona Natural (11 dígitos, inicia con 10)",
          path: ["ruc"],
        });
      }
      if (!data.direccionParticular || data.direccionParticular.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La dirección particular es obligatoria",
          path: ["direccionParticular"],
        });
      }
      if (!data.direccionComercial || data.direccionComercial.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La dirección comercial es obligatoria",
          path: ["direccionComercial"],
        });
      }
      if (!data.businessName || data.businessName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El nombre del negocio es obligatorio",
          path: ["businessName"],
        });
      }
      requireLogoFields(data, ctx);
      if (!data.businessSector) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona el rubro principal",
          path: ["businessSector"],
        });
      }
      if (
        !data.businessDescription ||
        data.businessDescription.trim().length < 20
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La descripción detallada debe tener al menos 20 caracteres",
          path: ["businessDescription"],
        });
      }
      if (!data.businessOperatingTime || data.businessOperatingTime.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica cuánto tiempo lleva funcionando tu negocio",
          path: ["businessOperatingTime"],
        });
      }
      if (!data.storeType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si tienes tienda física o vendes solo online",
          path: ["storeType"],
        });
      }
      if (!data.digitalPlatforms || data.digitalPlatforms.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica en qué plataformas digitales vendes",
          path: ["digitalPlatforms"],
        });
      }
      if (!data.needsExhibitionSpace) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si necesitas un espacio de exhibición",
          path: ["needsExhibitionSpace"],
        });
      }
      if (!data.logisticsItems || data.logisticsItems.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona al menos un elemento de logística",
          path: ["logisticsItems"],
        });
      }
      if (
        data.logisticsItems?.includes("otro") &&
        (!data.logisticsOther || data.logisticsOther.trim().length < 2)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Detalle el otro elemento de logística",
          path: ["logisticsOther"],
        });
      }
      if (!data.mainSalesChannel || data.mainSalesChannel.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica tu canal de venta principal",
          path: ["mainSalesChannel"],
        });
      }
      if (isArtesanoConNegocio(mainGroup, subClassification)) {
        requireArtesanalFields(data, ctx);
      }
      return;
    }

    if (
      isNegocioRuc20(mainGroup, subClassification) ||
      isArtesanoTallerAsociacion(mainGroup, subClassification)
    ) {
      if (!data.razonSocial || data.razonSocial.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La razón social es obligatoria",
          path: ["razonSocial"],
        });
      }
      requireLogoFields(data, ctx);
      if (!data.ruc || !/^20\d{9}$/.test(data.ruc)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El RUC debe ser de Persona Jurídica (11 dígitos, inicia con 20)",
          path: ["ruc"],
        });
      }
      if (!data.direccionComercial || data.direccionComercial.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La dirección comercial es obligatoria",
          path: ["direccionComercial"],
        });
      }
      if (!data.fullName || data.fullName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El nombre completo del representante legal es obligatorio",
          path: ["fullName"],
        });
      }
      if (!data.dni || !/^\d{8}$/.test(data.dni)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El DNI del representante legal debe tener 8 dígitos",
          path: ["dni"],
        });
      }
      if (!data.legalRepPosition || data.legalRepPosition.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El cargo en la empresa es obligatorio",
          path: ["legalRepPosition"],
        });
      }
      if (
        !data.legalRepPhone ||
        !/^(\+51)?[9]\d{8}$|^\d{9}$/.test(data.legalRepPhone)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresa un celular válido del representante legal",
          path: ["legalRepPhone"],
        });
      }
      if (!data.legalRepEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.legalRepEmail)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresa un correo válido del representante legal",
          path: ["legalRepEmail"],
        });
      }
      if (!data.businessSector) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona el rubro principal",
          path: ["businessSector"],
        });
      }
      if (
        !data.businessDescription ||
        data.businessDescription.trim().length < 20
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La descripción del negocio debe tener al menos 20 caracteres",
          path: ["businessDescription"],
        });
      }
      if (
        !data.mainProductsServices ||
        data.mainProductsServices.trim().length < 3
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica los productos o servicios principales",
          path: ["mainProductsServices"],
        });
      }
      if (!data.targetMarket) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona el mercado al que se dirige",
          path: ["targetMarket"],
        });
      }
      if (!data.needsExhibitionSpace) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si necesitas un espacio de exhibición",
          path: ["needsExhibitionSpace"],
        });
      }
      if (!data.logisticsItems || data.logisticsItems.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona al menos un elemento de logística",
          path: ["logisticsItems"],
        });
      }
      if (
        data.logisticsItems?.includes("otro") &&
        (!data.logisticsOther || data.logisticsOther.trim().length < 2)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Detalle el otro elemento de logística",
          path: ["logisticsOther"],
        });
      }
      if (
        !data.participationExpectations ||
        data.participationExpectations.trim().length < 3
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica qué esperas obtener del programa",
          path: ["participationExpectations"],
        });
      }
      if (
        !data.participationBenefits ||
        data.participationBenefits.trim().length < 3
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica qué beneficios crees que te aportará",
          path: ["participationBenefits"],
        });
      }
      if (isArtesanoTallerAsociacion(mainGroup, subClassification)) {
        requireArtesanalFields(data, ctx);
      }
      return;
    }

    if (!data.businessSector) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona un sector o rubro",
        path: ["businessSector"],
      });
    }

    if (requiresRucFields(mainGroup, subClassification)) {
      if (!data.ruc || !/^\d{11}$/.test(data.ruc)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El RUC debe tener exactamente 11 dígitos",
          path: ["ruc"],
        });
      }
      if (!data.razonSocial || data.razonSocial.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La razón social o nombre comercial es obligatorio",
          path: ["razonSocial"],
        });
      }
      if (!data.direccionLocal || data.direccionLocal.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La dirección del local/taller es obligatoria",
          path: ["direccionLocal"],
        });
      }
      if (!data.licenciaFuncionamiento) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica el estado de tu licencia de funcionamiento",
          path: ["licenciaFuncionamiento"],
        });
      }
    }

    if (isArtesanoGroup(mainGroup)) {
      requireArtesanalFields(data, ctx);
    }
  });
}

// ─── Paso 3: Información comercial / Compromisos ────────────────────────────

const baseStep3Schema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      "Ingresa una URL válida (https://...)"
    ),
  description: z.string().optional(),
  interests: z
    .array(z.enum(["ferias-eventos", "capacitaciones", "formalizacion", "difusion"]))
    .optional(),
  willingToParticipate: z.enum(["si", "no"]).optional(),
  wantToConnect: z.enum(["si", "no"]).optional(),
  acceptsTerms: z.enum(["si", "no"]).optional(),
  authorizesDataUse: z.enum(["si", "no"]).optional(),
});

export function getStep3Schema(mainGroup: MainGroup, subClassification: SubClassification) {
  return baseStep3Schema.superRefine((data, ctx) => {
    if (usesCommitmentsStep(mainGroup, subClassification)) {
      if (!data.willingToParticipate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si estás dispuesto a participar en los eventos de MoliEmprende",
          path: ["willingToParticipate"],
        });
      }
      if (!data.wantToConnect) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Indica si te gustaría conectar con otros emprendedores",
          path: ["wantToConnect"],
        });
      }
      if (!data.acceptsTerms) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes indicar si aceptas las bases y condiciones",
          path: ["acceptsTerms"],
        });
      } else if (data.acceptsTerms !== "si") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes aceptar las bases y condiciones para continuar",
          path: ["acceptsTerms"],
        });
      }
      if (!data.authorizesDataUse) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes indicar si autorizas el uso de tus datos",
          path: ["authorizesDataUse"],
        });
      } else if (data.authorizesDataUse !== "si") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes autorizar el uso de tus datos para continuar",
          path: ["authorizesDataUse"],
        });
      }
      return;
    }

    if (!data.description || data.description.trim().length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La descripción debe tener al menos 20 caracteres",
        path: ["description"],
      });
    }
    if (!data.interests || data.interests.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona al menos un interés de participación",
        path: ["interests"],
      });
    }
  });
}
