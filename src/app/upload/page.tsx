import { UploadForm } from "@/components/UploadForm";

export const metadata = {
  title: "업로드",
};

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">영상 등록</h1>
        <p className="mt-2 text-muted">
          YouTube · TikTok · X 링크를 등록하고 AI 툴 태그를 붙이세요
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
