import { NextResponse } from "next/server";
import { getCurrentPublicUser, requireAuth } from "@/lib/admin/auth";

export async function GET() {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await getCurrentPublicUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
