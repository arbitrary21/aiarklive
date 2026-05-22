import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const alt = "AI Video on AIARKLIVE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;

  let title = "AI Video";
  let toolLabel = "AI Generated";
  let author = "Anonymous";
  let thumbnail: string | null = null;

  try {
    const supabase = await createClient();
    const { data: video } = await supabase
      .from("videos")
      .select("title, thumbnail_url, ai_tools, user:users(username)")
      .eq("id", id)
      .single();

    if (video) {
      title = video.title ?? "AI Video";
      const firstTool = Array.isArray(video.ai_tools) ? video.ai_tools[0] : null;
      toolLabel = firstTool
        ? String(firstTool).charAt(0).toUpperCase() + String(firstTool).slice(1)
        : "AI Generated";
      const userObj = Array.isArray(video.user) ? video.user[0] : video.user;
      author = (userObj as { username?: string } | null)?.username ?? "Anonymous";
      thumbnail = video.thumbnail_url ?? null;
    }
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "#0f0f0f",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.2,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={title}
            style={{
              position: "absolute",
              right: 48,
              top: "50%",
              transform: "translateY(-50%)",
              width: 460,
              height: 340,
              objectFit: "cover",
              borderRadius: 16,
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            left: 60,
            top: 0,
            bottom: 0,
            width: 580,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(139, 92, 246, 0.9)",
              borderRadius: 8,
              padding: "6px 16px",
              width: "fit-content",
              color: "white",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {toolLabel}
          </div>

          <div
            style={{
              color: "white",
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              maxWidth: 540,
              overflow: "hidden",
              display: "-webkit-box",
            }}
          >
            {title.length > 80 ? title.slice(0, 80) + "…" : title}
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 22,
            }}
          >
            by @{author}
          </div>

          <div
            style={{
              marginTop: 24,
              color: "rgba(255,255,255,0.4)",
              fontSize: 18,
              letterSpacing: "0.05em",
            }}
          >
            AIARKLIVE.COM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
