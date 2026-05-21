import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoGrid } from "@/components/VideoGrid";
import { getUserById, getVideos } from "@/lib/videos";

interface ProfilePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = params;
  const user = await getUserById(id);
  return { title: user?.username ?? "프로필" };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = params;
  const user = await getUserById(id);

  if (!user) notFound();

  const videos = await getVideos({ userId: id });

  return (
    <div className="space-y-8">
      <section className="flex flex-col items-start gap-6 rounded-3xl border border-white/10 bg-surface p-8 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-3xl font-bold text-white">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{user.username}</h1>
          {user.bio && <p className="mt-2 max-w-xl text-muted">{user.bio}</p>}
          <p className="mt-3 text-sm text-muted">
            {videos.length}개 영상 ·{" "}
            {new Date(user.created_at).toLocaleDateString("ko-KR")} 가입
          </p>
        </div>
      </section>

      <div>
        <h2 className="mb-6 text-xl font-semibold text-white">포트폴리오</h2>
        <VideoGrid videos={videos} emptyMessage="아직 등록한 영상이 없습니다." />
      </div>

      <Link
        href="/upload"
        className="inline-block rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition hover:text-white"
      >
        + 새 영상 등록
      </Link>
    </div>
  );
}
