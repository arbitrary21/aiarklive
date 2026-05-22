import Link from "next/link";
import type { Metadata } from "next";
import { getVideos } from "@/lib/videos";
import { VideoGrid } from "@/components/VideoGrid";
import { ExternalLink, Sparkles, Zap, Image, Film } from "lucide-react";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Kling AI Video Generator — Examples & Guide | AIARKLIVE",
  description:
    "Explore top Kling AI videos, prompts & tutorials from the AIARKLIVE community. See text-to-video, image-to-video & motion brush examples. Free to browse.",
  openGraph: {
    title: "Kling AI Video Generator — Examples & Guide | AIARKLIVE",
    description:
      "Explore top Kling AI videos, prompts & tutorials from the AIARKLIVE community. See text-to-video, image-to-video & motion brush examples. Free to browse.",
    type: "website",
    siteName: "AIARKLIVE",
    url: "https://aiarklive.com/tools/kling",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kling AI Video Generator — Examples & Guide | AIARKLIVE",
    description:
      "Explore top Kling AI videos, prompts & tutorials from the AIARKLIVE community.",
  },
};

const SCHEMA_SOFTWARE = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Kling AI",
  description:
    "Kling AI is an AI-powered video generation tool that creates high-quality videos from text prompts and images.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: "https://klingai.com",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available",
  },
};

const FEATURES = [
  {
    icon: Film,
    title: "Text-to-Video",
    description:
      "Generate cinematic video clips from text descriptions. Kling AI supports up to 2 minutes of video at 1080p.",
  },
  {
    icon: Image,
    title: "Image-to-Video",
    description:
      "Bring any still image to life. Upload a photo and Kling AI animates it with realistic motion.",
  },
  {
    icon: Zap,
    title: "Motion Brush",
    description:
      "Paint motion onto specific areas of an image for precise, controlled animation effects.",
  },
  {
    icon: Sparkles,
    title: "Camera Control",
    description:
      "Simulate professional camera movements — pan, zoom, orbit — with AI-driven cinematography.",
  },
];

const PROMPTS = [
  "A lone astronaut walks across the surface of Mars at golden hour, cinematic, slow motion",
  "A paper origami crane unfolding in reverse, macro photography, white background",
  "Ocean waves crashing on black volcanic rocks, aerial drone shot, sunrise",
  "A neon-lit Tokyo street at night, rain reflections, looping cinemagraph style",
  "A scientist in a lab watching a glowing DNA strand rotate in mid-air, sci-fi lighting",
];

const COMPARISON = [
  {
    feature: "Free tier",
    kling: "✅ 66 credits/day",
    runway: "✅ 125 credits (one-time)",
    sora: "✅ Limited",
  },
  {
    feature: "Max video length",
    kling: "2 min",
    runway: "16 sec",
    sora: "20 sec",
  },
  {
    feature: "Max resolution",
    kling: "1080p",
    runway: "1080p",
    sora: "1080p",
  },
  {
    feature: "Image-to-video",
    kling: "✅",
    runway: "✅",
    sora: "✅",
  },
  {
    feature: "Motion brush",
    kling: "✅",
    runway: "❌",
    sora: "❌",
  },
  {
    feature: "Camera control",
    kling: "✅",
    runway: "✅",
    sora: "✅",
  },
];

export default async function KlingPage() {
  const videos = await getVideos({ aiTool: "kling", sort: "popular", limit: 12 });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_SOFTWARE) }}
      />

      <div className="mx-auto max-w-5xl space-y-16 pb-16">
        {/* Hero */}
        <section className="pt-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI Video Tool
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            Kling AI Video Generator —{" "}
            <span className="text-brand-300">Community Examples & Guide</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted">
            Discover what Kling AI can do. Browse real videos made by the
            AIARKLIVE community — text-to-video, image-to-video, motion brush,
            and more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/explore?tool=kling"
              className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Explore all AI videos
            </Link>
            <a
              href="https://klingai.com"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold text-muted transition hover:text-foreground"
              style={{ borderColor: "var(--border)" }}
            >
              Try Kling AI free
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* What Is Kling AI */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            What Is Kling AI?
          </h2>
          <div className="panel p-6 text-muted leading-relaxed space-y-3">
            <p>
              <strong className="text-foreground">Kling AI</strong> is an
              AI-powered video generation platform developed by Kuaishou
              Technology. It lets you create high-quality video clips from text
              prompts or images — no camera, no editing software required.
            </p>
            <p>
              Kling AI stands out for its generous free tier (66 credits/day),
              long video support (up to 2 minutes), and unique features like{" "}
              <strong className="text-foreground">Motion Brush</strong> — which
              lets you paint motion onto specific areas of an image — and
              professional-grade camera controls.
            </p>
            <p>
              It competes directly with Runway Gen-3, Sora, and PixVerse, but
              is often preferred for its realistic motion physics and free
              access.
            </p>
          </div>
        </section>

        {/* Community Videos */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Top Kling AI Videos from the Community
            </h2>
            <Link
              href="/leaderboard"
              className="text-sm text-brand-300 hover:underline"
            >
              View leaderboard →
            </Link>
          </div>
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="panel p-8 text-center text-muted">
              <p className="mb-4">No Kling AI videos yet — be the first!</p>
              <Link
                href="/upload"
                className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-400"
              >
                Upload your Kling AI video
              </Link>
            </div>
          )}
          {videos.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href="/explore?tool=kling"
                className="text-sm text-brand-300 hover:underline"
              >
                See all Kling AI videos →
              </Link>
            </div>
          )}
        </section>

        {/* Features */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Kling AI Features: Text-to-Video, Image-to-Video & Motion Brush
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="panel p-5 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Prompts */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Kling AI Prompts That Actually Work
          </h2>
          <p className="mb-4 text-muted">
            These prompt structures consistently produce high-quality results
            with Kling AI. The key is to be specific about subject, action,
            style, and camera.
          </p>
          <div className="space-y-2">
            {PROMPTS.map((prompt, i) => (
              <div
                key={i}
                className="panel flex items-start gap-3 p-4 text-sm"
              >
                <span className="shrink-0 rounded bg-brand-500/20 px-2 py-0.5 text-xs font-mono text-brand-300">
                  {i + 1}
                </span>
                <p className="text-muted leading-relaxed">{prompt}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Kling AI vs Runway vs Sora — Quick Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                  <th className="pb-3 pr-4 font-semibold text-muted">Feature</th>
                  <th className="pb-3 pr-4 font-semibold text-brand-300">Kling AI</th>
                  <th className="pb-3 pr-4 font-semibold text-muted">Runway</th>
                  <th className="pb-3 font-semibold text-muted">Sora</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="py-3 pr-4 text-muted">{row.feature}</td>
                    <td className="py-3 pr-4 font-medium text-foreground">{row.kling}</td>
                    <td className="py-3 pr-4 text-muted">{row.runway}</td>
                    <td className="py-3 text-muted">{row.sora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            * Data as of May 2026. Plans and features may change.{" "}
            <a
              href="https://klingai.com"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline hover:text-foreground"
            >
              Check Kling AI pricing
            </a>{" "}
            ·{" "}
            <Link href="/tools/runway" className="underline hover:text-foreground opacity-50 pointer-events-none">
              Runway guide (coming soon)
            </Link>
          </p>
        </section>

        {/* How To */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            How to Use Kling AI: Step-by-Step
          </h2>
          <ol className="space-y-3 text-muted">
            {[
              "Go to klingai.com and create a free account (66 credits refreshed daily).",
              'Select "AI Video" → choose "Text to Video" or "Image to Video".',
              "Write a detailed prompt: describe the subject, action, camera angle, and style.",
              "Set aspect ratio (16:9 for YouTube, 9:16 for shorts), duration (5s / 10s), and quality.",
              'Click "Generate" and wait ~2–5 minutes.',
              "Download your video or share it directly to AIARKLIVE!",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="panel p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground">
            Share Your Kling AI Video
          </h2>
          <p className="mb-6 text-muted">
            Made something with Kling AI? Upload it to AIARKLIVE and get
            discovered by thousands of AI creators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-400"
            >
              Upload your Kling AI video
            </Link>
            <Link
              href="/challenges"
              className="rounded-xl border px-6 py-3 font-semibold text-muted transition hover:text-foreground"
              style={{ borderColor: "var(--border)" }}
            >
              Join AI Challenges
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">
            Free to browse. Sign in to upload.
          </p>
        </section>
      </div>
    </>
  );
}
