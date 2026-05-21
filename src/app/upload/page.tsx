import { redirect } from "next/navigation";
import { UploadForm } from "@/components/UploadForm";
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

  if (configured && process.env.NODE_ENV === "production") {
    const user = await getCurrentUser();
    if (!user) {
      redirect("/login?next=/upload");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Add video</h1>
        <p className="mt-2 text-muted">
          Submit a YouTube, TikTok, or X link and tag the AI tools used
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
