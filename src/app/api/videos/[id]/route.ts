import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getVideoById, updateVideo } from "@/lib/videos";
import type { AiTool, Genre } from "@/lib/types";
import { AI_TOOLS, GENRES } from "@/lib/constants";

export const runtime = "edge";

const VALID_GENRES = new Set(GENRES.map((g) => g.value));
const VALID_TOOLS = new Set(AI_TOOLS.map((t) => t.value));

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { id } = await context.params;
    const video = await getVideoById(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }
    if (video.user_id !== user.id) {
      return NextResponse.json({ error: "Not allowed." }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      ai_tools,
      genre,
      prompt,
      ai_generated,
    } = body as {
      title?: string;
      description?: string | null;
      ai_tools?: AiTool[];
      genre?: Genre;
      prompt?: string | null;
      ai_generated?: boolean;
    };

    if (genre !== undefined && !VALID_GENRES.has(genre)) {
      return NextResponse.json({ error: "Invalid genre." }, { status: 400 });
    }
    if (ai_tools !== undefined) {
      if (!Array.isArray(ai_tools) || ai_tools.some((t) => !VALID_TOOLS.has(t))) {
        return NextResponse.json({ error: "Invalid AI tools." }, { status: 400 });
      }
    }

    const updated = await updateVideo(id, user.id, {
      title: title !== undefined ? String(title).trim() : undefined,
      description:
        description !== undefined
          ? description === null
            ? null
            : String(description).trim().slice(0, 500) || null
          : undefined,
      ai_tools,
      genre,
      prompt:
        prompt !== undefined
          ? prompt === null
            ? null
            : String(prompt).trim().slice(0, 2000) || null
          : undefined,
      ai_disclosed: ai_generated !== undefined ? Boolean(ai_generated) : undefined,
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed." },
      { status: 500 }
    );
  }
}
