"use client";

import { FileDropzone } from "@/components/ui/FileDropzone";
import type { Step2Data, YesNo } from "@/types/form";

interface LogoUploadSectionProps {
  data: Pick<Step2Data, "hasLogo" | "logoFile">;
  errors: Partial<Record<"hasLogo" | "logoFile", string>>;
  onChange: (field: keyof Step2Data, value: Step2Data[keyof Step2Data]) => void;
  label?: string;
}

export function LogoUploadSection({
  data,
  errors,
  onChange,
  label = "Logo del emprendimiento",
}: LogoUploadSectionProps) {
  const noLogo = data.hasLogo === "no";

  const handleNoLogoToggle = (checked: boolean) => {
    if (checked) {
      onChange("hasLogo", "no" as YesNo);
      onChange("logoFile", null);
    } else {
      onChange("hasLogo", "si" as YesNo);
    }
  };

  const handleFileChange = (file: File | null) => {
    onChange("logoFile", file);
    if (file) {
      onChange("hasLogo", "si" as YesNo);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">
        {label}
        {!noLogo && <span className="text-red-500"> *</span>}
      </p>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 bg-white/70 px-4 py-3 transition-colors hover:border-molina/40">
        <input
          type="checkbox"
          checked={noLogo}
          onChange={(e) => handleNoLogoToggle(e.target.checked)}
          className="h-5 w-5 shrink-0 rounded border-slate-300 text-molina focus:ring-molina"
        />
        <span className="text-sm font-medium text-slate-700">No tiene logo</span>
      </label>

      {!noLogo && (
        <FileDropzone
          value={data.logoFile ?? null}
          onChange={handleFileChange}
          error={errors.logoFile || errors.hasLogo}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          title="Arrastra tu logo aquí o haz clic para seleccionar"
          hint="Imagen (JPG, PNG, WEBP) o PDF — máx. 5 MB"
          ariaLabel="Adjuntar logo"
        />
      )}

      {noLogo && errors.hasLogo && (
        <p className="text-sm text-red-500">{errors.hasLogo}</p>
      )}
    </div>
  );
}
