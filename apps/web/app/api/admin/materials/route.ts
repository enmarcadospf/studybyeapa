import { lessons } from "@academia/shared";
import { NextResponse } from "next/server";
import {
  listLessonMaterials,
  upsertLessonMaterial,
} from "../../../../lib/server/lesson-material-store";

type MaterialRequest = {
  lessonId?: string;
  sourceTitle?: string;
  content?: string;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const materials = await listLessonMaterials();

  return NextResponse.json({ materials });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MaterialRequest;
    const lessonId = body.lessonId?.trim() ?? "";
    const content = body.content?.trim() ?? "";
    const sourceTitle = body.sourceTitle?.trim() ?? "Material de estudio";
    const lesson = lessons.find((item) => item.id === lessonId);

    if (!lesson) {
      return NextResponse.json(
        { message: "No encontramos la leccion seleccionada." },
        { status: 404 },
      );
    }

    if (content.length < 80) {
      return NextResponse.json(
        {
          message:
            "Agrega al menos 80 caracteres de material para que la IA tenga contexto real.",
        },
        { status: 400 },
      );
    }

    const material = await upsertLessonMaterial({
      lessonId,
      sourceTitle,
      content,
    });

    return NextResponse.json({ material });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo guardar el material de la leccion.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
