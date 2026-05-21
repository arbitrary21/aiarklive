import { UploadForm } from "@/components/UploadForm";

export const metadata = {
  title: "Upload",
};

export default function UploadPage() {
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
