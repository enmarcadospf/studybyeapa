import { NextResponse } from "next/server";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  listCalendarEvents,
} from "../../../../lib/server/student-tool-store";
import { getCurrentStudentSession } from "../../../../lib/server/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  }

  const events = await listCalendarEvents(student.id);
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  }

  const body = (await request.json()) as {
    date?: string;
    startTime?: string;
    endTime?: string;
    title?: string;
    subtitle?: string;
  };
  const title = body.title?.trim() ?? "";
  const date = body.date?.trim() ?? "";

  if (!title || !date) {
    return NextResponse.json(
      { message: "Completa título y fecha." },
      { status: 400 },
    );
  }

  const event = await createCalendarEvent(student.id, {
    date,
    startTime: body.startTime ?? "08:00",
    endTime: body.endTime ?? "09:00",
    title,
    subtitle: body.subtitle ?? "",
  });

  return NextResponse.json({ event }, { status: 201 });
}

export async function DELETE(request: Request) {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  }

  const body = (await request.json()) as {
    eventId?: string;
  };
  const eventId = body.eventId?.trim() ?? "";

  if (!eventId) {
    return NextResponse.json(
      { message: "Falta el evento a eliminar." },
      { status: 400 },
    );
  }

  await deleteCalendarEvent(student.id, eventId);
  return NextResponse.json({ ok: true });
}
