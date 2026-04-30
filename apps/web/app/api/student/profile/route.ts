import { NextResponse } from "next/server";
import { getCurrentStudentSession } from "../../../../lib/server/session";
import { updateStudentProfile } from "../../../../lib/server/student-store";

export async function PATCH(request: Request) {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesion." }, { status: 401 });
  }

  const body = (await request.json()) as {
    fullName?: string;
    university?: string;
    profileNote?: string;
  };

  const fullName = body.fullName?.trim() ?? "";

  if (!fullName) {
    return NextResponse.json(
      { message: "El nombre completo es obligatorio." },
      { status: 400 },
    );
  }

  const updatedStudent = await updateStudentProfile(student.id, {
    fullName,
    university: body.university ?? "",
    profileNote: body.profileNote ?? "",
  });

  return NextResponse.json({ student: updatedStudent });
}
