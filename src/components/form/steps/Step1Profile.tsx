"use client";

import { motion } from "framer-motion";
import { RadioCardGroup } from "@/components/ui/RadioCardGroup";
import {
  MAIN_GROUP_OPTIONS,
  EMPRENDEDOR_SUB_OPTIONS,
  ARTESANO_SUB_OPTIONS,
  type Step1Data,
  type MainGroup,
  type EmprendedorSubType,
  type ArtesanoSubType,
} from "@/types/form";

interface Step1ProfileProps {
  data: Step1Data;
  errors: Partial<Record<keyof Step1Data, string>>;
  onChange: (field: keyof Step1Data, value: Step1Data[keyof Step1Data]) => void;
}

export function Step1Profile({ data, errors, onChange }: Step1ProfileProps) {
  const subOptions =
    data.mainGroup === "emprendedor" ? EMPRENDEDOR_SUB_OPTIONS : ARTESANO_SUB_OPTIONS;

  const handleGroupChange = (group: MainGroup) => {
    onChange("mainGroup", group);
    const defaultSub: EmprendedorSubType | ArtesanoSubType =
      group === "emprendedor" ? "potencial" : "potencial";
    onChange("subClassification", defaultSub);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-molina-dark">
          Grupo de Pertenencia
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Selecciona la categoría que mejor describe tu perfil emprendedor o artesanal.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Categoría principal</p>
        <RadioCardGroup
          options={MAIN_GROUP_OPTIONS}
          value={data.mainGroup}
          onChange={handleGroupChange}
          columns={2}
          size="lg"
        />
        {errors.mainGroup && (
          <p className="text-sm text-red-500">{errors.mainGroup}</p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">
          Subclasificación —{" "}
          <span className="text-molina">
            {data.mainGroup === "emprendedor" ? "Grupo Emprendedor" : "Grupo Artesano"}
          </span>
        </p>
        <RadioCardGroup
          options={subOptions}
          value={data.subClassification}
          onChange={(val) => onChange("subClassification", val)}
          columns={2}
        />
        {errors.subClassification && (
          <p className="text-sm text-red-500">{errors.subClassification}</p>
        )}
      </div>
    </div>
  );
}
