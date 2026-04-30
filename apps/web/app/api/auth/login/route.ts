import { NextResponse } from "next/server";
import { authenticateStudent } from "../../../../lib/server/student-store";
import {
  createSessionCookieValue,
  getSessionCookieName,
} from "../../../../lib/server/session";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Ingresa tu correo y tu contrasena." },
      { status: 400 },
    );
  }

  const student = await authenticateStudent(email, password);

  if (!student) {
    return NextResponse.json(
      { message: "Correo o contrasena incorrectos." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ student });

  response.cookies.set({
    name: getSessionCookieName(),
    value: createSessionCookieValue(student.id),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
