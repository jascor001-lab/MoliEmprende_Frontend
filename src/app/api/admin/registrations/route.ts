import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/admin/auth";
import { readRegistrations } from "@/lib/registrations/store";
import { mergeRegistrationsByDni } from "@/lib/registrations/serialize";

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const records = await readRegistrations();
  const merged = mergeRegistrationsByDni(records);

  return NextResponse.json({
    records: merged,
    total: merged.length,
  });
}
