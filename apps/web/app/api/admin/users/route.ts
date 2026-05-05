import { NextResponse } from "next/server";
import {
  addAdminUser,
  listAdminUsers,
  removeAdminUser,
} from "../../../../lib/server/admin-store";
import { getCurrentAdminSession } from "../../../../lib/server/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return NextResponse.json({ message: "Debes entrar como admin." }, { status: 401 });
  }

  const admins = await listAdminUsers();

  return NextResponse.json({
    admins,
    currentAdmin: {
      email: admin.email,
      isOwner: admin.isOwner,
    },
  });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return NextResponse.json({ message: "Debes entrar como admin." }, { status: 401 });
  }

  if (!admin.isOwner) {
    return NextResponse.json(
      { message: "Solo el propietario puede agregar admins." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as {
    email?: string;
  };

  try {
    const admins = await addAdminUser(body.email ?? "", admin.email);
    return NextResponse.json({ admins });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo agregar el admin.";

    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdminSession();

  if (!admin) {
    return NextResponse.json({ message: "Debes entrar como admin." }, { status: 401 });
  }

  if (!admin.isOwner) {
    return NextResponse.json(
      { message: "Solo el propietario puede quitar admins." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as {
    email?: string;
  };

  try {
    const admins = await removeAdminUser(body.email ?? "");
    return NextResponse.json({ admins });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo quitar el admin.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
