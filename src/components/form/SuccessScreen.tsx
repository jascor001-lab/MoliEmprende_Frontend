"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

export function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-lg text-center"
    >
      <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-glass-lg backdrop-blur-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-molina/10"
        >
          <CheckCircle2 className="h-10 w-10 text-molina" />
        </motion.div>

        <h2 className="text-2xl font-bold text-molina-dark">
          ¡Registro completado con éxito!
        </h2>

        <p className="mt-4 text-slate-600 leading-relaxed">
          Tu solicitud ha sido enviada correctamente. El equipo de MoliEmprende revisará tu
          información y se comunicará contigo pronto.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-molina/5 p-4 text-sm text-molina">
          <Sparkles className="h-5 w-5" />
          <span>¡Bienvenido a la comunidad emprendedora de La Molina!</span>
        </div>
      </div>
    </motion.div>
  );
}
