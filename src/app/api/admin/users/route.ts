import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createUser,
  deleteUser,
  listUsers,
  setUserActive,
  type PanelRole,
} from "@/lib/admin/users";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const users = await listUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
      role?: PanelRole;
      fullName?: string;
    };

    const user = await createUser({
      username: body.username || "",
      password: body.password || "",
      role: body.role === "admin" ? "admin" : "user",
      fullName: body.fullName || "",
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo crear el usuario" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      id?: string;
      active?: boolean;
    };

    if (!body.id || typeof body.active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const user = await setUserActive(body.id, body.active, session.userId);
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo actualizar" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }

    await deleteUser(id, session.userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo eliminar" },
      { status: 400 }
    );
  }
}
