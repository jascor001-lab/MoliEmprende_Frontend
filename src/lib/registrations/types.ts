/** Registro plano listo para Excel / API (sin File). */

export interface RegistrationRecord {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Identidad y clasificación
  dni: string;
  mainGroup: "emprendedor" | "artesano";
  subClassification: string;

  // Contacto
  fullName: string;
  phone: string;
  email: string;

  // Documentos (metadatos)
  dniFileName?: string | null;
  hasLogo?: string;
  logoFileName?: string | null;

  // Direcciones / formalización
  direccionParticular?: string;
  direccionComercial?: string;
  direccionLocal?: string;
  housingType?: string;
  housingDetail?: string;
  ruc?: string;
  razonSocial?: string;
  licenciaFuncionamiento?: string;
  legalRepPosition?: string;
  legalRepPhone?: string;
  legalRepEmail?: string;

  // Negocio / idea
  businessSector?: string;
  businessName?: string;
  businessIdeaName?: string;
  businessDescription?: string;
  businessIdeaDescription?: string;
  targetAudience?: string;
  motivation?: string;
  requiredResources?: string;
  belongsToAssociation?: string;
  associationDetail?: string;
  businessOperatingTime?: string;
  storeType?: string;
  digitalPlatforms?: string;
  mainSalesChannel?: string;
  digitalMarketingExperience?: string;
  participatedBusinessEvents?: string;
  mainProductsServices?: string;
  targetMarket?: string;
  companySize?: string;
  yearsMarketExperience?: string;
  mainCompanyChallenges?: string;

  // Formalización / logística (sin RUC y afines)
  participatedInExpositions?: string;
  rucProcessStarted?: string;
  rucProcessStage?: string;
  rucProcessStageOther?: string;
  needsFormalizationHelp?: string;
  needsExhibitionSpace?: string;
  logisticsItems?: string;
  logisticsOther?: string;

  // Digital
  website?: string;
  socialPlatforms?: string;
  socialNetworksDetail?: string;

  // Artesano (vacío en emprendedor → filtrable en Excel)
  lineaArtesanal?: string;
  rnaStatus?: string;
  rnaNumber?: string;

  // Compromisos / redes paso 3
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  websiteStep3?: string;
  description?: string;
  interests?: string;
  willingToParticipate?: string;
  wantToConnect?: string;
  acceptsTerms?: string;
  authorizesDataUse?: string;
  participationExpectations?: string;
  participationBenefits?: string;
}

/** Columnas Excel: orden fijo, compatible emprendedor + artesano */
export const EXCEL_COLUMNS: { key: keyof RegistrationRecord; header: string }[] = [
  { key: "dni", header: "DNI" },
  { key: "mainGroup", header: "Grupo" },
  { key: "subClassification", header: "Subclasificación" },
  { key: "createdAt", header: "Fecha registro" },
  { key: "updatedAt", header: "Última actualización" },
  { key: "fullName", header: "Nombre completo" },
  { key: "phone", header: "Teléfono" },
  { key: "email", header: "Correo" },
  { key: "direccionParticular", header: "Dirección particular" },
  { key: "direccionComercial", header: "Dirección comercial" },
  { key: "direccionLocal", header: "Dirección local" },
  { key: "housingType", header: "Tipo de vivienda" },
  { key: "housingDetail", header: "Detalle vivienda" },
  { key: "ruc", header: "RUC" },
  { key: "razonSocial", header: "Razón social" },
  { key: "licenciaFuncionamiento", header: "Licencia de funcionamiento" },
  { key: "legalRepPosition", header: "Cargo representante legal" },
  { key: "legalRepPhone", header: "Celular representante" },
  { key: "legalRepEmail", header: "Correo representante" },
  { key: "businessSector", header: "Rubro principal" },
  { key: "businessName", header: "Nombre emprendimiento / negocio" },
  { key: "businessIdeaName", header: "Nombre idea de negocio" },
  { key: "businessDescription", header: "Descripción negocio / productos" },
  { key: "businessIdeaDescription", header: "Descripción idea" },
  { key: "targetAudience", header: "Público objetivo" },
  { key: "motivation", header: "Motivación" },
  { key: "requiredResources", header: "Recursos necesarios" },
  { key: "belongsToAssociation", header: "Pertenece a asociación" },
  { key: "associationDetail", header: "Detalle asociación" },
  { key: "hasLogo", header: "Tiene logo" },
  { key: "logoFileName", header: "Archivo logo" },
  { key: "dniFileName", header: "Archivo DNI" },
  { key: "lineaArtesanal", header: "Línea artesanal" },
  { key: "rnaStatus", header: "Estado RNA" },
  { key: "rnaNumber", header: "Número RNA" },
  { key: "participatedInExpositions", header: "Participó en exposiciones" },
  { key: "rucProcessStarted", header: "Inició trámite RUC" },
  { key: "rucProcessStage", header: "Etapa trámite RUC" },
  { key: "rucProcessStageOther", header: "Etapa RUC (otro)" },
  { key: "needsFormalizationHelp", header: "Necesita ayuda formalización" },
  { key: "needsExhibitionSpace", header: "Necesita espacio exhibición" },
  { key: "logisticsItems", header: "Logística solicitada" },
  { key: "logisticsOther", header: "Logística (otro)" },
  { key: "businessOperatingTime", header: "Tiempo de operación" },
  { key: "storeType", header: "Tipo de tienda" },
  { key: "digitalPlatforms", header: "Plataformas digitales" },
  { key: "mainSalesChannel", header: "Canal de venta principal" },
  { key: "digitalMarketingExperience", header: "Experiencia marketing digital" },
  { key: "participatedBusinessEvents", header: "Participó en eventos" },
  { key: "mainProductsServices", header: "Productos o servicios principales" },
  { key: "targetMarket", header: "Mercado objetivo" },
  { key: "companySize", header: "Tamaño empresa" },
  { key: "yearsMarketExperience", header: "Años de experiencia" },
  { key: "mainCompanyChallenges", header: "Principales desafíos" },
  { key: "website", header: "Sitio web" },
  { key: "socialPlatforms", header: "Redes (plataformas)" },
  { key: "socialNetworksDetail", header: "Detalle redes sociales" },
  { key: "instagram", header: "Instagram" },
  { key: "facebook", header: "Facebook" },
  { key: "tiktok", header: "TikTok" },
  { key: "websiteStep3", header: "Web (compromisos)" },
  { key: "description", header: "Descripción adicional" },
  { key: "interests", header: "Intereses de participación" },
  { key: "willingToParticipate", header: "Dispuesto a participar" },
  { key: "wantToConnect", header: "Quiere conectarse" },
  { key: "acceptsTerms", header: "Acepta términos" },
  { key: "authorizesDataUse", header: "Autoriza uso de datos" },
  { key: "participationExpectations", header: "Expectativas de participación" },
  { key: "participationBenefits", header: "Beneficios esperados" },
];
