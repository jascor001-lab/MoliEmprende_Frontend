import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  MAX_AGE_MS,
  createAdminToken,
  validateAdminCredentials,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (
      !body.username ||
      !body.password ||
      !validateAdminCredentials(body.username, body.password)
    ) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(MAX_AGE_MS / 1000),
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
}
