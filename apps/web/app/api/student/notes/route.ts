import { NextResponse } from "next/server";
import {
  createStudyNote,
  deleteStudyNote,
  listStudyNotes,
} from "../../../../lib/server/student-tool-store";
import { getCurrentStudentSession } from "../../../../lib/server/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  }

  const notes = await listStudyNotes(student.id);
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    course?: string;
    content?: string;
  };
  const title = body.title?.trim() ?? "";
  const content = body.content?.trim() ?? "";

  if (!title || !content) {
    return NextResponse.json(
      { message: "Completa título y contenido." },
      { status: 400 },
    );
  }

  const note = await createStudyNote(student.id, {
    title,
    course: body.course ?? "General",
    content,
  });

  return NextResponse.json({ note }, { status: 201 });
}

export async function DELETE(request: Request) {
  const student = await getCurrentStudentSession();

  if (!student) {
    return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  }

  const body = (await request.json()) as {
    noteId?: string;
  };
  const noteId = body.noteId?.trim() ?? "";

  if (!noteId) {
    return NextResponse.json(
      { message: "Falta la nota a eliminar." },
      { status: 400 },
    );
  }

  await deleteStudyNote(student.id, noteId);
  return NextResponse.json({ ok: true });
}
