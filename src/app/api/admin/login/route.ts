import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  MAX_AGE_MS,
  createSessionToken,
} from "@/lib/admin/auth";
import { authenticateUser } from "@/lib/admin/users";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(body.username, body.password);
    if (!user) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      id: user.id,
      role: user.role,
      username: user.username,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    });

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
