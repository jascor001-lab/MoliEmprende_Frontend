"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Send, Info } from "lucide-react";
import { ProgressBar } from "@/components/form/ProgressBar";
import { ComunicadoFeriasModal } from "@/components/form/ComunicadoFeriasModal";
import { NotResidentScreen } from "@/components/form/NotResidentScreen";
import { SuccessScreen } from "@/components/form/SuccessScreen";
import { Step0Residence } from "@/components/form/steps/Step0Residence";
import { Step1Profile } from "@/components/form/steps/Step1Profile";
import { Step2Details } from "@/components/form/steps/Step2Details";
import { Step2EmprendedorPotencial } from "@/components/form/steps/Step2EmprendedorPotencial";
import { Step2EmprendedorSinRuc } from "@/components/form/steps/Step2EmprendedorSinRuc";
import { Step2Comerciante } from "@/components/form/steps/Step2Comerciante";
import { Step2NegocioRuc20 } from "@/components/form/steps/Step2NegocioRuc20";
import { Step2ArtesanoPotencial } from "@/components/form/steps/Step2ArtesanoPotencial";
import { Step2ArtesanoIndependiente } from "@/components/form/steps/Step2ArtesanoIndependiente";
import { Step2ArtesanoConNegocio } from "@/components/form/steps/Step2ArtesanoConNegocio";
import { Step2ArtesanoTaller } from "@/components/form/steps/Step2ArtesanoTaller";
import { Step3Commercial } from "@/components/form/steps/Step3Commercial";
import { Step3Commitments } from "@/components/form/steps/Step3Commitments";
import { llamarApi } from "@/lib/api/cliente";
import { aRegistroApi } from "@/lib/registrations/mapeo";
import { EscudoMolina } from "@/components/ui/EscudoMolina";
import {
  step0Schema,
  step1Schema,
  getStep2Schema,
  getStep3Schema,
} from "@/lib/validations";
import {
  INITIAL_FORM_DATA,
  isEmprendedorPotencial,
  isEmprendedorSinRuc,
  isComerciante,
  isNegocioRuc20,
  isArtesanoPotencial,
  isArtesanoIndependiente,
  isArtesanoConNegocio,
  isArtesanoTallerAsociacion,
  usesCommitmentsStep,
  syncsDniFromStep0,
  type MoliEmprendeFormData,
  type WizardStep,
  type Step0Data,
  type Step1Data,
  type Step2Data,
  type Step3Data,
} from "@/types/form";

const STEP_LABELS_DEFAULT = [
  "Verificación",
  "Perfil",
  "Datos del Negocio",
  "Compromisos",
];

const STEP_LABELS_POTENCIAL = [
  "Verificación",
  "Perfil",
  "Datos Personales e Idea",
  "Compromisos",
];

const STEP_LABELS_SIN_RUC = [
  "Verificación",
  "Perfil",
  "Datos del Emprendimiento",
  "Compromisos",
];

const STEP_LABELS_COMERCIANTE = [
  "Verificación",
  "Perfil",
  "Datos del Negocio",
  "Compromisos",
];

const STEP_LABELS_NEGOCIO = [
  "Verificación",
  "Perfil",
  "Datos de la Empresa",
  "Compromisos",
];

const STEP_LABELS_ARTESANO_POTENCIAL = [
  "Verificación",
  "Perfil",
  "Datos Personales e Idea",
  "Compromisos",
];

const STEP_LABELS_ARTESANO_INDEPENDIENTE = [
  "Verificación",
  "Perfil",
  "Datos Artesanales",
  "Compromisos",
];

const STEP_LABELS_ARTESANO_NEGOCIO = [
  "Verificación",
  "Perfil",
  "Datos del Negocio",
  "Compromisos",
];

const STEP_LABELS_ARTESANO_TALLER = [
  "Verificación",
  "Perfil",
  "Datos del Taller",
  "Compromisos",
];

function getStepLabels(
  mainGroup: MoliEmprendeFormData["step1"]["mainGroup"],
  subClassification: MoliEmprendeFormData["step1"]["subClassification"]
) {
  if (isArtesanoPotencial(mainGroup, subClassification)) return STEP_LABELS_ARTESANO_POTENCIAL;
  if (isArtesanoIndependiente(mainGroup, subClassification)) return STEP_LABELS_ARTESANO_INDEPENDIENTE;
  if (isArtesanoConNegocio(mainGroup, subClassification)) return STEP_LABELS_ARTESANO_NEGOCIO;
  if (isArtesanoTallerAsociacion(mainGroup, subClassification)) return STEP_LABELS_ARTESANO_TALLER;
  if (isEmprendedorPotencial(mainGroup, subClassification)) return STEP_LABELS_POTENCIAL;
  if (isEmprendedorSinRuc(mainGroup, subClassification)) return STEP_LABELS_SIN_RUC;
  if (isComerciante(mainGroup, subClassification)) return STEP_LABELS_COMERCIANTE;
  if (isNegocioRuc20(mainGroup, subClassification)) return STEP_LABELS_NEGOCIO;
  return STEP_LABELS_DEFAULT;
}

export function MoliEmprendeWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [showNoticeModal, setShowNoticeModal] = useState(true);
  const [formData, setFormData] = useState<MoliEmprendeFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { mainGroup, subClassification } = formData.step1;
  const isPotencial = isEmprendedorPotencial(mainGroup, subClassification);
  const isSinRuc = isEmprendedorSinRuc(mainGroup, subClassification);
  const isComercianteProfile = isComerciante(mainGroup, subClassification);
  const isNegocioProfile = isNegocioRuc20(mainGroup, subClassification);
  const isArtesanoPotencialProfile = isArtesanoPotencial(mainGroup, subClassification);
  const isArtesanoIndependienteProfile = isArtesanoIndependiente(mainGroup, subClassification);
  const isArtesanoConNegocioProfile = isArtesanoConNegocio(mainGroup, subClassification);
  const isArtesanoTallerProfile = isArtesanoTallerAsociacion(mainGroup, subClassification);
  const showCommitments = usesCommitmentsStep(mainGroup, subClassification);
  const stepLabels = getStepLabels(mainGroup, subClassification);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const timer = window.setTimeout(() => {
      el.scrollTop = 0;
    }, 50);
    return () => window.clearTimeout(timer);
  }, [currentStep, mainGroup, subClassification]);

  const updateStep0 = (field: keyof Step0Data, value: Step0Data[keyof Step0Data]) => {
    setFormData((prev) => ({ ...prev, step0: { ...prev.step0, [field]: value } }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateStep1 = (field: keyof Step1Data, value: Step1Data[keyof Step1Data]) => {
    setFormData((prev) => ({ ...prev, step1: { ...prev.step1, [field]: value } }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateStep2 = (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => {
    setFormData((prev) => ({ ...prev, step2: { ...prev.step2, [field]: value } }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateStep3 = (field: keyof Step3Data, value: Step3Data[keyof Step3Data]) => {
    setFormData((prev) => ({ ...prev, step3: { ...prev.step3, [field]: value } }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep0 = (): boolean => {
    if (!formData.step0.isLaMolinaResident) {
      setCurrentStep("not-resident");
      return false;
    }

    const result = step0Schema.safeParse(formData.step0);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const validateStep1 = (): boolean => {
    const result = step1Schema.safeParse(formData.step1);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = (): boolean => {
    const schema = getStep2Schema(mainGroup, subClassification);
    const result = schema.safeParse(formData.step2);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep3 = (): boolean => {
    const result = getStep3Schema(mainGroup, subClassification).safeParse(formData.step3);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!validateStep0()) return;
      setCurrentStep(1);
      setErrors({});
      return;
    }
    if (currentStep === 1) {
      if (!validateStep1()) return;
      if (syncsDniFromStep0(mainGroup, subClassification)) {
        setFormData((prev) => ({
          ...prev,
          step2: { ...prev.step2, dni: prev.step0.dni || prev.step2.dni },
        }));
      }
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (typeof currentStep === "number" && currentStep > 0) {
      setCurrentStep((currentStep - 1) as WizardStep);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      const { formDataToRegistration } = await import(
        "@/lib/registrations/serialize"
      );
      const payload = formDataToRegistration(formData);
      const resultado = await llamarApi("/registros", {
        metodo: "POST",
        cuerpo: aRegistroApi(payload),
        conSesion: false,
      });
      if (!resultado.ok) {
        throw new Error(resultado.error || "Error al enviar");
      }
      setCurrentStep("success");
    } catch {
      setErrors({ submit: "Error al enviar el formulario. Intenta nuevamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep2 = () => {
    if (isPotencial) {
      return (
        <Step2EmprendedorPotencial
          data={formData.step2}
          errors={errors}
          onChange={updateStep2}
        />
      );
    }
    if (isSinRuc) {
      return (
        <Step2EmprendedorSinRuc
          data={formData.step2}
          errors={errors}
          onChange={updateStep2}
        />
      );
    }
    if (isComercianteProfile) {
      return (
        <Step2Comerciante data={formData.step2} errors={errors} onChange={updateStep2} />
      );
    }
    if (isNegocioProfile) {
      return (
        <Step2NegocioRuc20 data={formData.step2} errors={errors} onChange={updateStep2} />
      );
    }
    if (isArtesanoPotencialProfile) {
      return (
        <Step2ArtesanoPotencial
          data={formData.step2}
          errors={errors}
          onChange={updateStep2}
        />
      );
    }
    if (isArtesanoIndependienteProfile) {
      return (
        <Step2ArtesanoIndependiente
          data={formData.step2}
          errors={errors}
          onChange={updateStep2}
        />
      );
    }
    if (isArtesanoConNegocioProfile) {
      return (
        <Step2ArtesanoConNegocio
          data={formData.step2}
          errors={errors}
          onChange={updateStep2}
        />
      );
    }
    if (isArtesanoTallerProfile) {
      return (
        <Step2ArtesanoTaller
          data={formData.step2}
          errors={errors}
          onChange={updateStep2}
        />
      );
    }
    return (
      <Step2Details
        step1={formData.step1}
        data={formData.step2}
        errors={errors}
        onChange={updateStep2}
      />
    );
  };

  const renderStep3 = () => {
    if (showCommitments) {
      return (
        <Step3Commitments data={formData.step3} errors={errors} onChange={updateStep3} />
      );
    }
    return (
      <Step3Commercial data={formData.step3} errors={errors} onChange={updateStep3} />
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step0Residence data={formData.step0} errors={errors} onChange={updateStep0} />
        );
      case 1:
        return (
          <Step1Profile data={formData.step1} errors={errors} onChange={updateStep1} />
        );
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  if (currentStep === "not-resident") {
    return <NotResidentScreen />;
  }

  if (currentStep === "success") {
    return <SuccessScreen />;
  }

  const numericStep = currentStep as number;
  const stepAnimationKey = `step-${numericStep}-${mainGroup}-${subClassification}`;

  return (
    <>
      <ComunicadoFeriasModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
      />

      <div className="mx-auto flex h-full max-h-screen w-full max-w-3xl flex-col py-2 sm:py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 shrink-0 text-center sm:mb-6"
        >
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <EscudoMolina className="h-10 w-10" />
            <span className="text-sm font-semibold uppercase tracking-widest text-molina">
              Municipalidad de La Molina
            </span>
          </div>
          <h1 className="text-3xl font-bold text-molina-dark sm:text-4xl">
            Moli<span className="text-molina">Emprende</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Registro de emprendedores y artesanos del distrito
          </p>
          <div className="mt-2.5 flex justify-center">
            <button
              type="button"
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-molina/30 bg-molina/10 px-3.5 py-1 text-xs font-semibold text-molina transition-all hover:bg-molina hover:text-white"
            >
              <Info className="h-3.5 w-3.5" />
              Ver comunicado y requisitos de ferias
            </button>
          </div>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex min-h-0 flex-1 flex-col rounded-2xl border border-white/30 bg-white/70 p-4 shadow-glass-lg backdrop-blur-md sm:p-6"
      >
        {numericStep > 0 && (
          <div className="shrink-0">
            <ProgressBar
              currentStep={numericStep - 1}
              totalSteps={3}
              labels={stepLabels.slice(1)}
            />
          </div>
        )}

        <div
          ref={scrollContainerRef}
          className="form-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 sm:pr-2"
        >
          <motion.div
            key={stepAnimationKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderCurrentStep()}
          </motion.div>

          {errors.submit && (
            <p className="mt-4 text-center text-sm text-red-500">{errors.submit}</p>
          )}
        </div>

        <div className="mt-4 flex shrink-0 items-center justify-between gap-4 border-t border-slate-200/60 pt-4 sm:mt-6 sm:pt-6">
          {numericStep > 0 ? (
            <motion.button
              type="button"
              onClick={handleBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl border-2 border-slate-200 px-5 py-3 font-medium text-slate-600 transition-colors hover:border-molina/30 hover:text-molina"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </motion.button>
          ) : (
            <div />
          )}

          <motion.button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-molina px-6 py-3 font-semibold text-white shadow-glass transition-shadow hover:shadow-glass-lg disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                />
                Enviando...
              </>
            ) : numericStep === 3 ? (
              <>
                <Send className="h-4 w-4" />
                Enviar Registro
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <p className="mt-3 shrink-0 text-center text-xs text-slate-400 sm:mt-4">
        © {new Date().getFullYear()} Municipalidad de La Molina — MoliEmprende
      </p>
    </div>
    </>
  );
}
