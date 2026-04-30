import { NextResponse } from "next/server";
import { getCurrentStudentSession } from "../../../../lib/server/session";
import { changeStudentPassword } from "../../../../lib/server/student-store";

export async function POST(request: Request) {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesion." }, { status: 401 });
  }

  const body = (await request.json()) as {
    currentPassword?: string;
    nextPassword?: string;
    nextPasswordConfirmation?: string;
  };

  const currentPassword = body.currentPassword ?? "";
  const nextPassword = body.nextPassword ?? "";
  const nextPasswordConfirmation = body.nextPasswordConfirmation ?? "";

  if (!currentPassword || !nextPassword) {
    return NextResponse.json(
      { message: "Completa la contrasena actual y la nueva." },
      { status: 400 },
    );
  }

  if (nextPassword.length < 6) {
    return NextResponse.json(
      { message: "La nueva contrasena debe tener al menos 6 caracteres." },
      { status: 400 },
    );
  }

  if (nextPassword !== nextPasswordConfirmation) {
    return NextResponse.json(
      { message: "La confirmacion no coincide." },
      { status: 400 },
    );
  }

  try {
    await changeStudentPassword(student.id, currentPassword, nextPassword);
    return NextResponse.json({ message: "Contrasena actualizada." });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo cambiar la contrasena.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
