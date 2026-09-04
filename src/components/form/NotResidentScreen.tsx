"use client";

import { motion } from "framer-motion";
import { MessageCircle, Heart, MapPin } from "lucide-react";
import { WHATSAPP_COMMUNITY_URL } from "@/types/form";

export function NotResidentScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-lg text-center"
    >
      <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-glass-lg backdrop-blur-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-molina/10"
        >
          <Heart className="h-10 w-10 text-molina" />
        </motion.div>

        <h2 className="text-2xl font-bold text-molina-dark">
          Gracias por tu interés en MoliEmprende
        </h2>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4 text-molina" />
          <span>Municipalidad de La Molina</span>
        </div>

        <p className="mt-6 text-slate-600 leading-relaxed">
          Este registro es exclusivo para vecinos del distrito de La Molina. Te invitamos a
          sumarte a nuestra comunidad para estar al tanto de todas las actividades
          institucionales.
        </p>

        <motion.a
          href={WHATSAPP_COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
          Unirse al Canal Oficial de WhatsApp
        </motion.a>

        <p className="mt-4 text-xs text-slate-400">
          Recibe noticias, eventos y oportunidades de la Municipalidad de La Molina
        </p>
      </div>
    </motion.div>
  );
}
