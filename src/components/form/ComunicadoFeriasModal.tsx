"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  GraduationCap,
  Store,
  ListOrdered,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  Lightbulb,
  Armchair,
  Flag,
  Tent,
} from "lucide-react";
import { EscudoMolina } from "@/components/ui/EscudoMolina";

interface ComunicadoFeriasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComunicadoFeriasModal({
  isOpen,
  onClose,
}: ComunicadoFeriasModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
          {/* Backdrop con desenfoque */}
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Ventana modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl border border-white/40 bg-white/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Cabecera institucional */}
          <div className="relative shrink-0 border-b border-slate-200/80 bg-gradient-to-r from-molina/10 via-emerald-50/50 to-white px-5 py-4 sm:px-8 sm:py-5">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-700 sm:right-6 sm:top-5"
              aria-label="Cerrar comunicado"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <EscudoMolina className="h-10 w-10 sm:h-12 sm:w-12" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-widest text-molina">
                  Municipalidad de La Molina
                </span>
                <span className="block text-xs font-semibold text-slate-500">
                  Gerencia de Desarrollo Económico e Inversión Privada
                </span>
              </div>
            </div>

            <h2 className="mt-3 text-lg font-black tracking-tight text-molina-dark sm:text-2xl">
              COMUNICADO A LOS NUEVOS EMPRENDEDORES
            </h2>
            <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">
              Participación en Ferias Promovidas por la Gerencia de Desarrollo Económico e Inversión Privada
            </p>
          </div>

          {/* Cuerpo scrollable */}
          <div className="form-scroll flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6 space-y-6 text-slate-700 text-sm leading-relaxed">
            {/* Mensaje de bienvenida y gratuidad */}
            <div className="space-y-2">
              <p>
                La <strong className="text-molina-dark">Gerencia de Desarrollo Económico e Inversión Privada de la Municipalidad de La Molina</strong> invita
                a los emprendedores interesados en participar en las diferentes{" "}
                <strong className="text-molina-dark">ferias y actividades de promoción comercial</strong> que se vienen desarrollando, con la finalidad de generar
                espacios que contribuyan a la promoción, posicionamiento y crecimiento de sus emprendimientos.
              </p>

              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 sm:p-4 text-emerald-950">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-molina" />
                <p className="text-xs sm:text-sm leading-normal">
                  Las ferias promovidas por la Municipalidad son de{" "}
                  <strong className="font-bold uppercase text-molina">Participación Totalmente Gratuita</strong>. Sin embargo, para acceder a estos espacios, los
                  emprendedores deberán cumplir previamente con los criterios establecidos por la Gerencia.
                </p>
              </div>
            </div>

            {/* Tarjeta: Requisito previo obligatorio */}
            <div className="rounded-2xl border-2 border-amber-200/80 bg-amber-50/60 p-4 sm:p-5 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm sm:text-base">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-800">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <h3>📌 REQUISITO PREVIO PARA PARTICIPAR EN LAS FERIAS</h3>
              </div>
              
              <p className="font-semibold text-slate-900">
                La participación en las capacitaciones, talleres y actividades de fortalecimiento empresarial promovidas por la Gerencia de Desarrollo Económico e Inversión Privada constituye un requisito previo para poder participar en las ferias municipales.
              </p>

              <p className="text-xs sm:text-sm text-slate-600">
                Estas capacitaciones tienen como finalidad fortalecer los conocimientos y capacidades de los emprendedores en temas relacionados con la gestión empresarial, atención al cliente, presentación de productos, formalización, marketing, ventas, buenas prácticas, entre otros temas que contribuyan al desarrollo de sus negocios.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 italic">
                Una vez cumplida esta etapa, los emprendedores podrán ser considerados dentro del proceso de evaluación para su participación en las ferias, de acuerdo con las características y disponibilidad de cada actividad.
              </p>
            </div>

            {/* Tarjeta: Requisitos de implementación del stand */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm sm:text-base">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-molina/15 text-molina">
                  <Store className="h-4 w-4" />
                </div>
                <h3>📋 REQUISITOS PARA LA PARTICIPACIÓN EN LAS FERIAS</h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600">
                Los emprendedores que sean seleccionados deberán contar con los siguientes elementos para la adecuada presentación de su stand:
              </p>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
                  <Tent className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <div>
                    <span className="block font-semibold text-slate-800 text-xs sm:text-sm">
                      Toldo color caqui
                    </span>
                    <span className="text-xs text-slate-500">Medida requerida: 2 m x 2 m</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
                  <Palette className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div>
                    <span className="block font-semibold text-slate-800 text-xs sm:text-sm">
                      Mantel de tela verde loro
                    </span>
                    <span className="text-xs text-slate-500">Medida aproximada: de 2 a 3 metros</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                  <div>
                    <span className="block font-semibold text-slate-800 text-xs sm:text-sm">
                      Iluminación adecuada
                    </span>
                    <span className="text-xs text-slate-500">Instalación eléctrica para su stand</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
                  <Armchair className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  <div>
                    <span className="block font-semibold text-slate-800 text-xs sm:text-sm">
                      Mesa y sillas
                    </span>
                    <span className="text-xs text-slate-500">Para la correcta atención al público</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs sm:col-span-2">
                  <Flag className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <div>
                    <span className="block font-semibold text-slate-800 text-xs sm:text-sm">
                      Banner de la marca – Roll Screen
                    </span>
                    <span className="text-xs text-slate-500">
                      Con la identidad gráfica e información oficial de su emprendimiento
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta: Proceso de participación paso a paso */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm sm:text-base">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
                  <ListOrdered className="h-4 w-4" />
                </div>
                <h3>🔎 PROCESO DE PARTICIPACIÓN</h3>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    num: "1",
                    title: "Inscripción y participación en capacitaciones",
                    desc: "Promovidas por la Gerencia de Desarrollo Económico e Inversión Privada.",
                  },
                  {
                    num: "2",
                    title: "Cumplimiento de requisitos y criterios",
                    desc: "Acatar los estándares establecidos para las actividades comerciales.",
                  },
                  {
                    num: "3",
                    title: "Evaluación previa del emprendimiento",
                    desc: "Considerando rubro, productos, presentación y características de cada feria.",
                  },
                  {
                    num: "4",
                    title: "Contacto directo por la Gerencia",
                    desc: "Los emprendedores que cumplan con los criterios serán contactados para confirmar su participación.",
                  },
                  {
                    num: "5",
                    title: "Información oportuna de la feria",
                    desc: "Se informará oportunamente fecha, horario, ubicación, temática y demás condiciones.",
                  },
                  {
                    num: "6",
                    title: "Participación totalmente gratuita",
                    desc: "No genera ningún costo por concepto de espacio o stand municipal.",
                  },
                ].map((item) => (
                  <div key={item.num} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-molina/15 text-xs font-bold text-molina">
                      {item.num}
                    </span>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-slate-800">{item.title}:</strong>{" "}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cierre y compromiso municipal */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white p-4 text-center space-y-1.5">
              <p className="font-bold text-molina text-sm sm:text-base">
                🤝 ¡FORTALECEMOS JUNTOS NUESTROS EMPRENDIMIENTOS!
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                La Municipalidad de La Molina reafirma su compromiso de brindar oportunidades gratuitas de promoción y comercialización, fortaleciendo las capacidades de los emprendedores y generando espacios que contribuyan al crecimiento de sus negocios.
              </p>
              <p className="text-xs font-semibold text-slate-800 pt-1">
                ¡Capacítate, fortalece tu emprendimiento y participa en nuestras ferias!
              </p>
            </div>
          </div>

          {/* Pie del modal con botón de acción */}
          <div className="shrink-0 border-t border-slate-200/80 bg-slate-50/90 px-5 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-molina shrink-0" />
              <span>Convocatoria oficial para emprendedores y artesanos molinenses</span>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-molina px-6 py-3 font-semibold text-white shadow-glass transition-all hover:shadow-glass-lg"
            >
              <span>Entendido, continuar al formulario</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
