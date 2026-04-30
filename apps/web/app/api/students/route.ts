import { NextResponse } from "next/server";
import {
  createStudent,
  listStudents,
  registerStudentDevice,
} from "../../../lib/server/student-store";
import { sendWelcomeEmail } from "../../../lib/server/email";
import {
  createSessionCookieValue,
  getDeviceCookieName,
  getOrCreateDeviceId,
  getSessionCookieName,
} from "../../../lib/server/session";

export async function GET() {
  const students = await listStudents();
  return NextResponse.json({ students });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
  };

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const passwordConfirmation = body.passwordConfirmation ?? "";

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { message: "Completa nombre, correo y contrasena." },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: "La contrasena debe tener al menos 6 caracteres." },
      { status: 400 },
    );
  }

  if (password !== passwordConfirmation) {
    return NextResponse.json(
      { message: "Las contrasenas no coinciden." },
      { status: 400 },
    );
  }

  try {
    const student = await createStudent({ fullName, email, password });
    const deviceId = getOrCreateDeviceId(
      request.headers.get("cookie")
        ?.split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${getDeviceCookieName()}=`))
        ?.split("=")[1],
    );
    const updatedStudent =
      (await registerStudentDevice({
        studentId: student.id,
        deviceId,
        userAgent: request.headers.get("user-agent") ?? "Navegador web",
      })) ?? student;

    try {
      await sendWelcomeEmail({
        to: updatedStudent.email,
        fullName: updatedStudent.fullName,
      });
    } catch (emailError) {
      console.error("Welcome email failed", emailError);
    }

    const response = NextResponse.json({ student: updatedStudent }, { status: 201 });

    response.cookies.set({
      name: getSessionCookieName(),
      value: createSessionCookieValue(student.id),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    response.cookies.set({
      name: getDeviceCookieName(),
      value: deviceId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo crear la cuenta.";

    return NextResponse.json({ message }, { status: 409 });
  }
}
