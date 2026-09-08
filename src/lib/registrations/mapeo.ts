import type { RegistrationRecord } from "./types";

/**
 * El wizard usa nombres en inglés y la base de datos en español.
 * Toda la traducción vive aquí, así ningún componente ni el backend
 * tiene que conocer el vocabulario del otro lado.
 */
const CAMPOS: Record<keyof RegistrationRecord, string> = {
  id: "id",
  createdAt: "creadoEn",
  updatedAt: "actualizadoEn",

  dni: "dni",
  mainGroup: "grupoPrincipal",
  subClassification: "subclasificacion",

  fullName: "nombreCompleto",
  phone: "telefono",
  email: "correo",

  dniFileName: "archivoDni",
  hasLogo: "tieneLogo",
  logoFileName: "archivoLogo",

  direccionParticular: "direccionParticular",
  direccionComercial: "direccionComercial",
  direccionLocal: "direccionLocal",
  housingType: "tipoVivienda",
  housingDetail: "detalleVivienda",
  ruc: "ruc",
  razonSocial: "razonSocial",
  licenciaFuncionamiento: "licenciaFuncionamiento",
  legalRepPosition: "cargoRepresentante",
  legalRepPhone: "telefonoRepresentante",
  legalRepEmail: "correoRepresentante",

  businessSector: "rubroPrincipal",
  businessName: "nombreNegocio",
  businessIdeaName: "nombreIdeaNegocio",
  businessDescription: "descripcionNegocio",
  businessIdeaDescription: "descripcionIdea",
  targetAudience: "publicoObjetivo",
  motivation: "motivacion",
  requiredResources: "recursosNecesarios",
  belongsToAssociation: "perteneceAsociacion",
  associationDetail: "detalleAsociacion",
  businessOperatingTime: "tiempoOperacion",
  storeType: "tipoTienda",
  digitalPlatforms: "plataformasDigitales",
  mainSalesChannel: "canalVentaPrincipal",
  digitalMarketingExperience: "experienciaMarketingDigital",
  participatedBusinessEvents: "participoEventosNegocio",
  mainProductsServices: "productosServiciosPrincipales",
  targetMarket: "mercadoObjetivo",
  companySize: "tamanoEmpresa",
  yearsMarketExperience: "aniosExperiencia",
  mainCompanyChallenges: "principalesDesafios",

  participatedInExpositions: "participoExposiciones",
  rucProcessStarted: "tramiteRucIniciado",
  rucProcessStage: "etapaTramiteRuc",
  rucProcessStageOther: "etapaTramiteRucOtro",
  needsFormalizationHelp: "necesitaAyudaFormalizacion",
  needsExhibitionSpace: "necesitaEspacioExhibicion",
  logisticsItems: "logisticaSolicitada",
  logisticsOther: "logisticaOtro",

  website: "sitioWeb",
  socialPlatforms: "redesPlataformas",
  socialNetworksDetail: "detalleRedesSociales",

  lineaArtesanal: "lineaArtesanal",
  rnaStatus: "estadoRna",
  rnaNumber: "numeroRna",

  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  websiteStep3: "sitioWebCompromisos",
  description: "descripcionAdicional",
  interests: "interesesParticipacion",
  willingToParticipate: "dispuestoParticipar",
  wantToConnect: "quiereConectarse",
  acceptsTerms: "aceptaTerminos",
  authorizesDataUse: "autorizaUsoDatos",
  participationExpectations: "expectativasParticipacion",
  participationBenefits: "beneficiosEsperados",
};

/** El backend asigna el id y las fechas, por eso no se envían. */
const SOLO_LECTURA: (keyof RegistrationRecord)[] = ["id", "createdAt", "updatedAt"];

/** Registro del wizard → cuerpo que espera POST /api/registros. */
export function aRegistroApi(record: RegistrationRecord): Record<string, string> {
  const cuerpo: Record<string, string> = {};

  for (const [campoIngles, campoEspanol] of Object.entries(CAMPOS)) {
    const clave = campoIngles as keyof RegistrationRecord;
    if (SOLO_LECTURA.includes(clave)) continue;

    const valor = record[clave];
    if (valor === undefined || valor === null) continue;

    const texto = String(valor).trim();
    if (texto !== "") cuerpo[campoEspanol] = texto;
  }

  return cuerpo;
}

/** Fila de la tabla registros → registro que consumen el panel y el Excel. */
export function aRegistroPanel(fila: Record<string, unknown>): RegistrationRecord {
  const record: Record<string, unknown> = {};

  for (const [campoIngles, campoEspanol] of Object.entries(CAMPOS)) {
    const valor = fila[campoEspanol];
    record[campoIngles] = valor === null || valor === undefined ? "" : String(valor);
  }

  return record as unknown as RegistrationRecord;
}
