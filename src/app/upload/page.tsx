import { redirect } from "next/navigation";
import { UploadForm } from "@/components/UploadForm";
import { YouTubeConnectBanner } from "@/components/youtube/YouTubeConnectBanner";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "edge";

export const metadata = {
  title: "Upload",
};

export default async function UploadPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let user = null;
  if (configured && process.env.NODE_ENV === "production") {
    user = await getCurrentUser();
    if (!user) {
      redirect("/login?next=/upload");
    }
  } else if (configured) {
    user = await getCurrentUser();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add video</h1>
        <p className="mt-2 text-muted">
          Submit a YouTube, TikTok, or X link and tag the AI tools used
        </p>
      </div>
      {configured && (
        <YouTubeConnectBanner
          initialVerified={Boolean(user?.youtube_channel_id)}
          initialChannelTitle={user?.youtube_channel_title ?? null}
        />
      )}
      <UploadForm />
    </div>
  );
}
