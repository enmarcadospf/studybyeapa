import { NextResponse } from "next/server";
import { getCurrentStudentSession } from "../../../../../lib/server/session";
import { revokeStudentDevice } from "../../../../../lib/server/student-store";

type RouteContext = {
  params: Promise<{
    deviceId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesion." }, { status: 401 });
  }

  const { deviceId } = await context.params;
  const updatedStudent = await revokeStudentDevice(student.id, deviceId);

  return NextResponse.json({ student: updatedStudent });
}
