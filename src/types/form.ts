// ─── Enums y constantes de clasificación ─────────────────────────────────────

export type WizardStep = 0 | 1 | 2 | 3 | "success" | "not-resident";

export type MainGroup = "emprendedor" | "artesano";

export type EmprendedorSubType =
  | "potencial"
  | "emprendedor"
  | "comerciante"
  | "negocio";

export type ArtesanoSubType =
  | "potencial"
  | "independiente"
  | "con-negocio"
  | "taller-asociacion";

export type SubClassification = EmprendedorSubType | ArtesanoSubType;

export type LicenciaFuncionamiento = "si" | "en-tramite" | "no";

export type RnaStatus = "si" | "no" | "en-tramite";

export type BusinessSector = string;

export type ArtesanalLine =
  | "textil"
  | "ceramica"
  | "cuero"
  | "madera"
  | "joyeria"
  | "bisuteria"
  | "manualidades"
  | "otro";

export type ParticipationInterest =
  | "ferias-eventos"
  | "capacitaciones"
  | "formalizacion"
  | "difusion";

export type YesNo = "si" | "no";

export type HousingType = "propia" | "alquilada" | "familiar" | "otro";

export type RucProcessStage =
  | "en-proceso"
  | "proximo-iniciar"
  | "no-programado"
  | "otro";

export type LogisticItem =
  | "toldo-3x3"
  | "toldo-2x2"
  | "iluminacion"
  | "banner-roll"
  | "mesa-150"
  | "mesa-300"
  | "sillas"
  | "sombrilla"
  | "mesita-publicitaria"
  | "colgador-prendas"
  | "cable-extension"
  | "cable-vulcanizado"
  | "modulo-publicitario"
  | "rejillas"
  | "mantel-verde"
  | "mostradores-joyas"
  | "sin-logistica"
  | "otro";

export type StoreType = "fisica" | "online" | "ambos";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "youtube"
  | "twitter"
  | "otro";

export type TargetMarket = "b2b" | "b2c" | "ambos";

// ─── Interfaces por paso ─────────────────────────────────────────────────────

export interface Step0Data {
  dni: string;
  dniFile: File | null;
  isLaMolinaResident: boolean;
}

export interface Step1Data {
  mainGroup: MainGroup;
  subClassification: SubClassification;
}

export interface Step2Data {
  // Campos generales
  fullName: string;
  phone: string;
  email: string;
  businessSector?: BusinessSector;

  // Emprendedor potencial
  dni?: string;
  direccionParticular?: string;
  businessIdeaName?: string;
  businessIdeaDescription?: string;
  targetAudience?: string;
  motivation?: string;
  requiredResources?: string;
  belongsToAssociation?: YesNo;
  associationDetail?: string;

  // Emprendedor sin RUC
  housingType?: HousingType;
  housingDetail?: string;
  businessName?: string;
  businessDescription?: string;
  hasLogo?: YesNo;
  logoFile?: File | null;
  participatedInExpositions?: YesNo;
  rucProcessStarted?: YesNo;
  rucProcessStage?: RucProcessStage;
  rucProcessStageOther?: string;
  needsFormalizationHelp?: YesNo;
  needsExhibitionSpace?: YesNo;
  logisticsItems?: LogisticItem[];
  logisticsOther?: string;

  // Comerciante (RUC 10 — Persona Natural)
  direccionComercial?: string;
  website?: string;
  socialPlatforms?: SocialPlatform[];
  socialNetworksDetail?: string;
  businessOperatingTime?: string;
  storeType?: StoreType;
  digitalPlatforms?: string;
  mainSalesChannel?: string;
  digitalMarketingExperience?: string;
  participatedBusinessEvents?: string;
  participationExpectations?: string;
  participationBenefits?: string;

  // Negocio (RUC 20 — Persona Jurídica)
  legalRepPosition?: string;
  legalRepPhone?: string;
  legalRepEmail?: string;
  mainProductsServices?: string;
  targetMarket?: TargetMarket;
  companySize?: string;
  yearsMarketExperience?: string;
  mainCompanyChallenges?: string;

  // Campos RUC (comerciante, negocio, con-negocio, taller-asociacion)
  ruc?: string;
  razonSocial?: string;
  direccionLocal?: string;
  licenciaFuncionamiento?: LicenciaFuncionamiento;

  // Campos artesano (cualquier sub-tipo de artesano)
  lineaArtesanal?: ArtesanalLine;
  rnaStatus?: RnaStatus;
  rnaNumber?: string;
}

export interface Step3Data {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
  description?: string;
  interests?: ParticipationInterest[];

  // Compromisos — Emprendedor potencial / sin RUC
  willingToParticipate?: YesNo;
  wantToConnect?: YesNo;
  acceptsTerms?: YesNo;
  authorizesDataUse?: YesNo;
}

export interface MoliEmprendeFormData {
  step0: Step0Data;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
}

// ─── Opciones de UI (labels + iconos) ───────────────────────────────────────

export interface RadioCardOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: string;
}

export const MAIN_GROUP_OPTIONS: RadioCardOption<MainGroup>[] = [
  {
    value: "emprendedor",
    label: "Grupo Emprendedor",
    description: "Negocios, comercio y emprendimientos en marcha o en desarrollo",
    icon: "rocket",
  },
  {
    value: "artesano",
    label: "Grupo Artesano",
    description: "Producción artesanal, talleres y asociaciones culturales",
    icon: "palette",
  },
];

export const EMPRENDEDOR_SUB_OPTIONS: RadioCardOption<EmprendedorSubType>[] = [
  {
    value: "potencial",
    label: "Emprendedor potencial",
    description: "Con idea de emprendimiento en desarrollo",
    icon: "lightbulb",
  },
  {
    value: "emprendedor",
    label: "Emprendedor",
    description: "Negocio en marcha sin RUC",
    icon: "rocket",
  },
  {
    value: "comerciante",
    label: "Comerciante",
    description: "Persona Natural con RUC 10",
    icon: "briefcase",
  },
  {
    value: "negocio",
    label: "Negocio",
    description: "Persona Jurídica con RUC 20",
    icon: "building",
  },
];

export const ARTESANO_SUB_OPTIONS: RadioCardOption<ArtesanoSubType>[] = [
  {
    value: "potencial",
    label: "Artesano potencial / Aprendiz",
    description: "En formación o fase inicial de creación",
    icon: "sparkles",
  },
  {
    value: "independiente",
    label: "Artesano independiente",
    description: "Produce y vende de forma artesanal sin RUC",
    icon: "hand",
  },
  {
    value: "con-negocio",
    label: "Artesano con negocio",
    description: "Persona Natural con RUC 10",
    icon: "scroll",
  },
  {
    value: "taller-asociacion",
    label: "Taller o Empresa Artesanal / Asociación",
    description: "Persona Jurídica RUC 20 / Asociación",
    icon: "landmark",
  },
];

export const BUSINESS_SECTOR_OPTIONS: { value: string; label: string }[] = [
  { value: "bisuteria-joyeria-artesanal", label: "Bisutería y Joyería Artesanal" },
  { value: "ceramica-alfareria", label: "Cerámica y Alfarería" },
  { value: "pintura-dibujo", label: "Pintura y Dibujo" },
  { value: "escultura-tallado", label: "Escultura y Tallado" },
  { value: "textiles-tejidos", label: "Textiles y Tejidos" },
  { value: "marroquineria-cuero", label: "Marroquinería y Cuero" },
  { value: "madera-bambu", label: "Madera y Bambú" },
  { value: "papeleria-artesanal-encuadernacion", label: "Papelería Artesanal y Encuadernación" },
  { value: "velas-jabones-artesanales", label: "Velas y Jabones Artesanales" },
  { value: "productos-decoracion-hechos-a-mano", label: "Productos de Decoración Hechos a Mano" },
  { value: "ropa-diseno-independiente", label: "Ropa de Diseño Independiente" },
  { value: "calzado-artesanal", label: "Calzado Artesanal" },
  { value: "bolsos-carteras", label: "Bolsos y Carteras" },
  { value: "accesorios-moda", label: "Accesorios de Moda (Sombreros, Bufandas, etc.)" },
  { value: "joyeria-bisuteria", label: "Joyería y Bisutería" },
  { value: "gafas-sol-accesorios", label: "Gafas de Sol y Accesorios" },
  { value: "cosmetica-natural-vegana", label: "Cosmética Natural y Vegana" },
  { value: "productos-gourmet-delicatessen", label: "Productos Gourmet y Delicatessen" },
  { value: "alimentos-organicos-saludables", label: "Alimentos Orgánicos y Saludables" },
  { value: "panaderia-pasteleria-artesanal", label: "Panadería y Pastelería Artesanal" },
  { value: "dulces-postres", label: "Dulces y Postres" },
  { value: "bebidas-artesanales", label: "Bebidas Artesanales (Cerveza, Vino, etc.)" },
  { value: "cafe-te-especialidad", label: "Café y Té de Especialidad" },
  { value: "lacteos-quesos-artesanales", label: "Productos Lácteos y Quesos Artesanales" },
  { value: "conservas-encurtidos", label: "Conservas y Encurtidos" },
  { value: "aceites-vinagres-artesanales", label: "Aceites y Vinagres Artesanales" },
  { value: "diseno-grafico-web", label: "Diseño Gráfico y Web" },
  { value: "fotografia-video", label: "Fotografía y Video" },
  { value: "consultoria-asesoria", label: "Consultoría y Asesoría" },
  { value: "clases-talleres", label: "Clases y Talleres" },
  { value: "servicios-belleza-bienestar", label: "Servicios de Belleza y Bienestar" },
  { value: "marketing-digital-redes", label: "Marketing Digital y Redes Sociales" },
  { value: "traduccion-interpretacion", label: "Traducción e Interpretación" },
  { value: "organizacion-eventos", label: "Servicios de Organización de Eventos" },
  { value: "libros-publicaciones", label: "Libros y Publicaciones" },
  { value: "plantas-jardineria", label: "Plantas y Jardinería" },
  { value: "productos-mascotas", label: "Productos para Mascotas" },
  { value: "juegos-juguetes-didacticos", label: "Juegos y Juguetes Didácticos" },
  { value: "articulos-limpieza-ecologicos", label: "Artículos de Limpieza Ecológicos" },
  { value: "otros", label: "Otros" },
];

export const ARTESANAL_LINE_OPTIONS: RadioCardOption<ArtesanalLine>[] = [
  { value: "textil", label: "Textil", icon: "scissors" },
  { value: "ceramica", label: "Cerámica", icon: "circle" },
  { value: "cuero", label: "Cuero", icon: "layers" },
  { value: "madera", label: "Madera", icon: "tree" },
  { value: "joyeria", label: "Joyería", icon: "gem" },
  { value: "bisuteria", label: "Bisutería", icon: "sparkles" },
  { value: "manualidades", label: "Manualidades", icon: "paintbrush" },
  { value: "otro", label: "Otro", icon: "ellipsis" },
];

export const LICENCIA_OPTIONS: RadioCardOption<LicenciaFuncionamiento>[] = [
  { value: "si", label: "Sí", description: "Cuenta con licencia vigente" },
  { value: "en-tramite", label: "En trámite", description: "Licencia en proceso" },
  { value: "no", label: "No", description: "No cuenta con licencia" },
];

export const YES_NO_OPTIONS: RadioCardOption<YesNo>[] = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

export const HOUSING_TYPE_OPTIONS: RadioCardOption<HousingType>[] = [
  { value: "propia", label: "Vivienda Propia", icon: "home" },
  { value: "alquilada", label: "Alquilada", icon: "key" },
  { value: "familiar", label: "Familiar", description: "Detalle el parentesco", icon: "users" },
  { value: "otro", label: "Otro", icon: "ellipsis" },
];

export const RUC_PROCESS_STAGE_OPTIONS: RadioCardOption<RucProcessStage>[] = [
  { value: "en-proceso", label: "En Proceso" },
  { value: "proximo-iniciar", label: "Próximo a iniciar" },
  {
    value: "no-programado",
    label: "No tengo programado hacerlo en un lapso menor a 1 año",
  },
  { value: "otro", label: "Otros" },
];

export const LOGISTICS_OPTIONS: { value: LogisticItem; label: string }[] = [
  { value: "toldo-3x3", label: "Toldo 3x3" },
  { value: "toldo-2x2", label: "Toldo 2x2" },
  { value: "iluminacion", label: "Iluminación" },
  { value: "banner-roll", label: "Banner de marca (Roll Screen)" },
  { value: "mesa-150", label: "Mesa 1.50 mts" },
  { value: "mesa-300", label: "Mesa 3.00 mts" },
  { value: "sillas", label: "Sillas" },
  { value: "sombrilla", label: "Sombrilla" },
  { value: "mesita-publicitaria", label: "Mesita Publicitaria" },
  { value: "colgador-prendas", label: "Colgador de prendas" },
  { value: "cable-extension", label: "Cable (extensión 30 mts)" },
  { value: "cable-vulcanizado", label: "Cable Vulcanizado" },
  { value: "modulo-publicitario", label: "Módulo Publicitario" },
  { value: "rejillas", label: "Rejillas" },
  { value: "mantel-verde", label: "Mantel verde" },
  { value: "mostradores-joyas", label: "Mostradores para joyas" },
  { value: "sin-logistica", label: "Aún no cuento con logística" },
  { value: "otro", label: "Otro" },
];

export const STORE_TYPE_OPTIONS: RadioCardOption<StoreType>[] = [
  { value: "fisica", label: "Tienda física", icon: "store" },
  { value: "online", label: "Solo online", icon: "globe" },
  { value: "ambos", label: "Tienda física y online", icon: "layers" },
];

export const SOCIAL_PLATFORM_OPTIONS: { value: SocialPlatform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "otro", label: "Otro" },
];

export const TARGET_MARKET_OPTIONS: RadioCardOption<TargetMarket>[] = [
  { value: "b2b", label: "B2B", description: "Empresas y negocios" },
  { value: "b2c", label: "B2C", description: "Consumidor final" },
  { value: "ambos", label: "Ambos", description: "B2B y B2C" },
];

export const RNA_STATUS_OPTIONS: RadioCardOption<RnaStatus>[] = [
  { value: "si", label: "Sí", description: "Registrado en el RNA" },
  { value: "en-tramite", label: "En trámite", description: "Registro en proceso" },
  { value: "no", label: "No", description: "Sin registro RNA" },
];

export const PARTICIPATION_OPTIONS: {
  value: ParticipationInterest;
  label: string;
  description: string;
}[] = [
  {
    value: "ferias-eventos",
    label: "Participación en Ferias y Eventos Municipales",
    description: "Exposición en ferias y eventos de la municipalidad",
  },
  {
    value: "capacitaciones",
    label: "Capacitaciones y Talleres Gratuitos",
    description: "Acceso a programas de formación sin costo",
  },
  {
    value: "formalizacion",
    label: "Asesoría para Formalización (RUC / Licencias)",
    description: "Apoyo en trámites de formalización empresarial",
  },
  {
    value: "difusion",
    label: "Difusión en Canales Municipales",
    description: "Promoción en redes y medios institucionales",
  },
];

// ─── Helpers de lógica condicional ────────────────────────────────────────────

export function requiresRucFields(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  if (mainGroup === "emprendedor") {
    return subClassification === "comerciante" || subClassification === "negocio";
  }
  return subClassification === "con-negocio" || subClassification === "taller-asociacion";
}

export function isArtesanoGroup(mainGroup: MainGroup): boolean {
  return mainGroup === "artesano";
}

export function isEmprendedorPotencial(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return mainGroup === "emprendedor" && subClassification === "potencial";
}

export function isEmprendedorSinRuc(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return mainGroup === "emprendedor" && subClassification === "emprendedor";
}

export function isComerciante(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return mainGroup === "emprendedor" && subClassification === "comerciante";
}

export function isNegocioRuc20(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return mainGroup === "emprendedor" && subClassification === "negocio";
}

export function isArtesanoPotencial(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return mainGroup === "artesano" && subClassification === "potencial";
}

export function isArtesanoIndependiente(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return mainGroup === "artesano" && subClassification === "independiente";
}

export function isArtesanoConNegocio(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return mainGroup === "artesano" && subClassification === "con-negocio";
}

export function isArtesanoTallerAsociacion(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return mainGroup === "artesano" && subClassification === "taller-asociacion";
}

export function usesCommitmentsStep(
  mainGroup: MainGroup,
  _subClassification: SubClassification
): boolean {
  return mainGroup === "emprendedor" || mainGroup === "artesano";
}

export function syncsDniFromStep0(
  mainGroup: MainGroup,
  subClassification: SubClassification
): boolean {
  return usesCommitmentsStep(mainGroup, subClassification);
}

export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/INVITE_LINK_MUNICIPALIDAD_LA_MOLINA";

export const INITIAL_FORM_DATA: MoliEmprendeFormData = {
  step0: {
    dni: "",
    dniFile: null,
    isLaMolinaResident: false,
  },
  step1: {
    mainGroup: "emprendedor",
    subClassification: "potencial",
  },
  step2: {
    fullName: "",
    phone: "",
    email: "",
    businessSector: "",
    dni: "",
    direccionParticular: "",
    businessIdeaName: "",
    businessIdeaDescription: "",
    targetAudience: "",
    motivation: "",
    requiredResources: "",
    belongsToAssociation: undefined,
    associationDetail: "",
    housingType: undefined,
    housingDetail: "",
    businessName: "",
    businessDescription: "",
    hasLogo: undefined,
    logoFile: null,
    participatedInExpositions: undefined,
    rucProcessStarted: undefined,
    rucProcessStage: undefined,
    rucProcessStageOther: "",
    needsFormalizationHelp: undefined,
    needsExhibitionSpace: undefined,
    logisticsItems: [],
    logisticsOther: "",
    direccionComercial: "",
    website: "",
    socialPlatforms: [],
    socialNetworksDetail: "",
    businessOperatingTime: "",
    storeType: undefined,
    digitalPlatforms: "",
    mainSalesChannel: "",
    digitalMarketingExperience: "",
    participatedBusinessEvents: "",
    participationExpectations: "",
    participationBenefits: "",
    legalRepPosition: "",
    legalRepPhone: "",
    legalRepEmail: "",
    mainProductsServices: "",
    targetMarket: undefined,
    companySize: "",
    yearsMarketExperience: "",
    mainCompanyChallenges: "",
    razonSocial: "",
    ruc: "",
  },
  step3: {
    instagram: "",
    facebook: "",
    tiktok: "",
    website: "",
    description: "",
    interests: [],
    willingToParticipate: undefined,
    wantToConnect: undefined,
    acceptsTerms: undefined,
    authorizesDataUse: undefined,
  },
};
