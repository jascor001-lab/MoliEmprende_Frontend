import * as XLSX from "xlsx";
import {
  EXCEL_COLUMNS,
  type RegistrationRecord,
} from "@/lib/registrations/types";
import { mergeRegistrationsByDni } from "@/lib/registrations/serialize";

const GROUP_LABELS: Record<string, string> = {
  emprendedor: "Emprendedor",
  artesano: "Artesano",
};

function formatCell(
  key: keyof RegistrationRecord,
  value: RegistrationRecord[keyof RegistrationRecord]
): string | number {
  if (value === undefined || value === null || value === "") return "";
  if (key === "mainGroup") return GROUP_LABELS[String(value)] ?? String(value);
  if (key === "createdAt" || key === "updatedAt") {
    try {
      return new Date(String(value)).toLocaleString("es-PE", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/** Genera un ArrayBuffer .xlsx: una fila por DNI, columnas unificadas. */
export function buildRegistrationsWorkbook(
  records: RegistrationRecord[]
): ArrayBuffer {
  const merged = mergeRegistrationsByDni(records);

  const rows = merged.map((record) => {
    const row: Record<string, string | number> = {};
    for (const col of EXCEL_COLUMNS) {
      row[col.header] = formatCell(col.key, record[col.key]);
    }
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: EXCEL_COLUMNS.map((c) => c.header),
  });

  worksheet["!cols"] = EXCEL_COLUMNS.map((col) => ({
    wch: Math.min(Math.max(col.header.length + 2, 14), 40),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

  return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
}

export function downloadRegistrationsExcel(
  records: RegistrationRecord[],
  filename = `moliemprende-registros-${new Date().toISOString().slice(0, 10)}.xlsx`
) {
  const buffer = buildRegistrationsWorkbook(records);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
