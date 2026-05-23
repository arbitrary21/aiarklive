import Link from "next/link";
import type { Metadata } from "next";
import { getVideos } from "@/lib/videos";
import { VideoGrid } from "@/components/VideoGrid";
import { ExternalLink, Sparkles, Zap, Film, Palette } from "lucide-react";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "PixVerse AI Video Generator — Examples & Guide | AIARKLIVE",
  description:
    "Explore top PixVerse AI videos, prompts & tutorials from the AIARKLIVE community. See text-to-video, anime-style and stylized video generation examples. Free to browse.",
  openGraph: {
    title: "PixVerse AI Video Generator — Examples & Guide | AIARKLIVE",
    description:
      "Explore top PixVerse AI videos, prompts & tutorials from the AIARKLIVE community. Free to browse.",
    type: "website",
    siteName: "AIARKLIVE",
    url: "https://aiarklive.com/tools/pixverse",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixVerse AI Video Generator — Examples & Guide | AIARKLIVE",
    description:
      "Explore top PixVerse AI videos, prompts & tutorials from the AIARKLIVE community.",
  },
};

const SCHEMA_SOFTWARE = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PixVerse",
  description:
    "PixVerse is an AI video generation platform known for its anime, stylized, and creative video outputs from text and image inputs.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: "https://pixverse.ai",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available with daily credits",
  },
};

const FEATURES = [
  {
    icon: Film,
    title: "Text-to-Video",
    description:
      "Generate stylized and anime-quality video clips from descriptive text prompts with PixVerse's signature visual style.",
  },
  {
    icon: Palette,
    title: "Style Control",
    description:
      "Choose from anime, realistic, 3D, and other styles. PixVerse excels at non-realistic artistic aesthetics.",
  },
  {
    icon: Zap,
    title: "Image-to-Video",
    description:
      "Animate any image — especially illustrations and artwork — with smooth, style-consistent motion.",
  },
  {
    icon: Sparkles,
    title: "Template Library",
    description:
      "Kickstart your creation with PixVerse's curated prompt templates, ideal for beginners learning AI video.",
  },
];

const PROMPTS = [
  "A samurai standing on a rooftop at sunset, anime style, wind blowing through hair, cinematic",
  "A fantasy dragon soaring through clouds over a medieval castle, stylized 3D animation",
  "A lofi girl studying at her desk, pastel colors, rain on window, cozy anime atmosphere",
  "Cherry blossoms falling in slow motion, traditional Japanese art style, soft depth of field",
  "A cyberpunk cityscape at night, neon signs reflecting in puddles, anime aesthetic",
];

const COMPARISON = [
  {
    feature: "Free tier",
    pixverse: "✅ Daily credits",
    kling: "✅ 66 credits/day",
    runway: "✅ 125 credits (one-time)",
  },
  {
    feature: "Max video length",
    pixverse: "8 sec",
    kling: "2 min",
    runway: "16 sec",
  },
  {
    feature: "Anime/stylized mode",
    pixverse: "✅ Excellent",
    kling: "⚠️ Limited",
    runway: "⚠️ Limited",
  },
  {
    feature: "Image-to-video",
    pixverse: "✅",
    kling: "✅",
    runway: "✅",
  },
  {
    feature: "Style presets",
    pixverse: "✅ Many",
    kling: "⚠️ Few",
    runway: "❌",
  },
  {
    feature: "Camera control",
    pixverse: "⚠️ Basic",
    kling: "✅",
    runway: "✅",
  },
];

export default async function PixVersePage() {
  const videos = await getVideos({ aiTool: "pixverse", sort: "popular", limit: 12 });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_SOFTWARE) }}
      />

      <div className="mx-auto max-w-5xl space-y-16 pb-16">
        {/* Hero */}
        <section className="pt-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI Video Tool
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            PixVerse AI —{" "}
            <span className="text-violet-300">Community Examples & Guide</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted">
            Discover what PixVerse can do. Browse real videos made by the
            AIARKLIVE community — anime-style, stylized, and creative AI videos
            from text and images.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/explore?tool=pixverse"
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Explore all PixVerse videos
            </Link>
            <a
              href="https://pixverse.ai"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold text-muted transition hover:text-foreground"
              style={{ borderColor: "var(--border)" }}
            >
              Try PixVerse free
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* What Is PixVerse */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            What Is PixVerse?
          </h2>
          <div className="panel p-6 text-muted leading-relaxed space-y-3">
            <p>
              <strong className="text-foreground">PixVerse</strong> is an AI
              video generation platform that has become the go-to choice for{" "}
              <strong className="text-foreground">anime, stylized, and artistic video generation</strong>.
              While tools like Runway and Kling focus on photorealism, PixVerse
              excels at non-realistic aesthetics.
            </p>
            <p>
              With a generous free tier, an intuitive style selector, and a
              growing template library, PixVerse is especially popular among
              anime fans, illustrators, and creators who want to bring their
              artwork to life.
            </p>
            <p>
              PixVerse v4 competes directly with Kling AI, Runway Gen-3, and
              Hailuo Video, but occupies a unique niche in the stylized/anime
              content space.
            </p>
          </div>
        </section>

        {/* Community Videos */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Top PixVerse Videos from the Community
            </h2>
            <Link
              href="/leaderboard"
              className="text-sm text-violet-300 hover:underline"
            >
              View leaderboard →
            </Link>
          </div>
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="panel p-8 text-center text-muted">
              <p className="mb-4">No PixVerse videos yet — be the first!</p>
              <Link
                href="/upload"
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Upload your PixVerse video
              </Link>
            </div>
          )}
          {videos.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href="/explore?tool=pixverse"
                className="text-sm text-violet-300 hover:underline"
              >
                See all PixVerse videos →
              </Link>
            </div>
          )}
        </section>

        {/* Features */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            PixVerse Features: Anime Style, Templates & Image Animation
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="panel p-5 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
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
            PixVerse Prompts That Actually Work
          </h2>
          <p className="mb-4 text-muted">
            PixVerse shines with stylized content. These prompts are optimized
            for anime, artistic, and stylized aesthetics — PixVerse&apos;s
            strongest areas.
          </p>
          <div className="space-y-2">
            {PROMPTS.map((prompt, i) => (
              <div
                key={i}
                className="panel flex items-start gap-3 p-4 text-sm"
              >
                <span className="shrink-0 rounded bg-violet-500/20 px-2 py-0.5 text-xs font-mono text-violet-300">
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
            PixVerse vs Kling AI vs Runway — Quick Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                  <th className="pb-3 pr-4 font-semibold text-muted">Feature</th>
                  <th className="pb-3 pr-4 font-semibold text-violet-300">PixVerse</th>
                  <th className="pb-3 pr-4 font-semibold text-muted">Kling AI</th>
                  <th className="pb-3 font-semibold text-muted">Runway</th>
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
                    <td className="py-3 pr-4 font-medium text-foreground">{row.pixverse}</td>
                    <td className="py-3 pr-4 text-muted">{row.kling}</td>
                    <td className="py-3 text-muted">{row.runway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            * Data as of May 2026. Plans and features may change.{" "}
            <a
              href="https://pixverse.ai"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline hover:text-foreground"
            >
              Check PixVerse pricing
            </a>{" "}
            ·{" "}
            <Link href="/tools/kling" className="underline hover:text-foreground">
              Kling AI guide
            </Link>{" "}
            ·{" "}
            <Link href="/tools/runway" className="underline hover:text-foreground">
              Runway guide
            </Link>
          </p>
        </section>

        {/* How To */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            How to Use PixVerse: Step-by-Step
          </h2>
          <ol className="space-y-3 text-muted">
            {[
              "Go to pixverse.ai and sign up for a free account.",
              "Click 'Create' and choose between Text to Video or Image to Video.",
              "Write a descriptive prompt — be specific about art style (anime, realistic, 3D).",
              "Select a style preset (Anime, 3D Animation, Realistic, etc.) for consistent results.",
              "Set video duration and aspect ratio, then click Generate.",
              "Download your video or share it on AIARKLIVE!",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">
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
            Share Your PixVerse Video
          </h2>
          <p className="mb-6 text-muted">
            Made something with PixVerse? Upload it to AIARKLIVE and get
            discovered by thousands of AI creators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500"
            >
              Upload your PixVerse video
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
