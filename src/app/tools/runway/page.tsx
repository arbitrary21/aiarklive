import Link from "next/link";
import type { Metadata } from "next";
import { getVideos } from "@/lib/videos";
import { VideoGrid } from "@/components/VideoGrid";
import { ExternalLink, Sparkles, Zap, Film, Layers } from "lucide-react";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Runway AI Video Generator — Examples & Guide | AIARKLIVE",
  description:
    "Explore top Runway Gen-3 Alpha videos, prompts & tutorials from the AIARKLIVE community. See text-to-video, image-to-video & motion control examples. Free to browse.",
  openGraph: {
    title: "Runway AI Video Generator — Examples & Guide | AIARKLIVE",
    description:
      "Explore top Runway Gen-3 Alpha videos, prompts & tutorials from the AIARKLIVE community. Free to browse.",
    type: "website",
    siteName: "AIARKLIVE",
    url: "https://aiarklive.com/tools/runway",
  },
  twitter: {
    card: "summary_large_image",
    title: "Runway AI Video Generator — Examples & Guide | AIARKLIVE",
    description:
      "Explore top Runway Gen-3 Alpha videos, prompts & tutorials from the AIARKLIVE community.",
  },
};

const SCHEMA_SOFTWARE = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Runway",
  description:
    "Runway is a professional AI video generation suite used by filmmakers and creators worldwide for text-to-video, image-to-video, and video editing.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: "https://runwayml.com",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free trial available with 125 credits",
  },
};

const FEATURES = [
  {
    icon: Film,
    title: "Gen-3 Alpha Turbo",
    description:
      "Runway's fastest model — generate cinematic video clips in seconds from text prompts with Hollywood-level quality.",
  },
  {
    icon: Layers,
    title: "Image-to-Video",
    description:
      "Transform any still image into a smooth, high-quality video. Ideal for product animations and scene transitions.",
  },
  {
    icon: Zap,
    title: "Motion Controls",
    description:
      "Precisely control camera movement and subject motion with Runway's advanced motion brush and camera presets.",
  },
  {
    icon: Sparkles,
    title: "Act One",
    description:
      "Bring characters to life by transferring your own performance onto any AI-generated character in real time.",
  },
];

const PROMPTS = [
  "A cinematic close-up of a teardrop falling in slow motion, golden hour backlight, 8K",
  "Two astronauts floating inside a futuristic space station, warm ambient light, handheld camera",
  "A vintage car racing through rain-soaked city streets at night, neon reflections, film grain",
  "A butterfly emerging from its chrysalis in extreme macro detail, nature documentary style",
  "Sweeping aerial shot over an ancient jungle temple at dawn, mist rising, cinematic grade",
];

const COMPARISON = [
  {
    feature: "Free tier",
    runway: "✅ 125 credits (one-time)",
    kling: "✅ 66 credits/day",
    pixverse: "✅ Daily credits",
  },
  {
    feature: "Max video length",
    runway: "16 sec",
    kling: "2 min",
    pixverse: "8 sec",
  },
  {
    feature: "Max resolution",
    runway: "1080p",
    kling: "1080p",
    pixverse: "1080p",
  },
  {
    feature: "Image-to-video",
    runway: "✅",
    kling: "✅",
    pixverse: "✅",
  },
  {
    feature: "Character animation",
    runway: "✅ Act One",
    kling: "❌",
    pixverse: "❌",
  },
  {
    feature: "Camera control",
    runway: "✅",
    kling: "✅",
    pixverse: "❌",
  },
];

export default async function RunwayPage() {
  const videos = await getVideos({ aiTool: "runway", sort: "popular", limit: 12 });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_SOFTWARE) }}
      />

      <div className="mx-auto max-w-5xl space-y-16 pb-16">
        {/* Hero */}
        <section className="pt-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI Video Tool
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            Runway Gen-3 Alpha —{" "}
            <span className="text-emerald-300">Community Examples & Guide</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted">
            Discover what Runway Gen-3 can do. Browse real videos made by the
            AIARKLIVE community — text-to-video, image-to-video, camera motion,
            and more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/explore?tool=runway"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Explore all Runway videos
            </Link>
            <a
              href="https://runwayml.com"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold text-muted transition hover:text-foreground"
              style={{ borderColor: "var(--border)" }}
            >
              Try Runway free
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* What Is Runway */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            What Is Runway?
          </h2>
          <div className="panel p-6 text-muted leading-relaxed space-y-3">
            <p>
              <strong className="text-foreground">Runway</strong> is a
              professional AI creative platform trusted by filmmakers, VFX
              artists, and content creators worldwide. Their{" "}
              <strong className="text-foreground">Gen-3 Alpha</strong> model
              delivers cinematic-quality video generation from text and image
              inputs.
            </p>
            <p>
              What sets Runway apart is its focus on{" "}
              <strong className="text-foreground">professional workflows</strong>{" "}
              — from Act One (character animation) to precise camera motion
              controls, it's built for creators who need more than just a
              "generate and hope" experience.
            </p>
            <p>
              Runway is used in production by teams at Netflix, Adobe, and
              top-tier creative agencies. It competes with Kling AI, PixVerse,
              and Sora.
            </p>
          </div>
        </section>

        {/* Community Videos */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Top Runway Videos from the Community
            </h2>
            <Link
              href="/leaderboard"
              className="text-sm text-emerald-300 hover:underline"
            >
              View leaderboard →
            </Link>
          </div>
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="panel p-8 text-center text-muted">
              <p className="mb-4">No Runway videos yet — be the first!</p>
              <Link
                href="/upload"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Upload your Runway video
              </Link>
            </div>
          )}
          {videos.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href="/explore?tool=runway"
                className="text-sm text-emerald-300 hover:underline"
              >
                See all Runway videos →
              </Link>
            </div>
          )}
        </section>

        {/* Features */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Runway Features: Gen-3 Alpha, Act One & Camera Controls
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="panel p-5 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
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
            Runway Gen-3 Prompts That Actually Work
          </h2>
          <p className="mb-4 text-muted">
            Runway Gen-3 excels at cinematic realism. These prompts leverage its
            strengths in lighting, physics, and camera movement.
          </p>
          <div className="space-y-2">
            {PROMPTS.map((prompt, i) => (
              <div
                key={i}
                className="panel flex items-start gap-3 p-4 text-sm"
              >
                <span className="shrink-0 rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-mono text-emerald-300">
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
            Runway vs Kling AI vs PixVerse — Quick Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                  <th className="pb-3 pr-4 font-semibold text-muted">Feature</th>
                  <th className="pb-3 pr-4 font-semibold text-emerald-300">Runway</th>
                  <th className="pb-3 pr-4 font-semibold text-muted">Kling AI</th>
                  <th className="pb-3 font-semibold text-muted">PixVerse</th>
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
                    <td className="py-3 pr-4 font-medium text-foreground">{row.runway}</td>
                    <td className="py-3 pr-4 text-muted">{row.kling}</td>
                    <td className="py-3 text-muted">{row.pixverse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            * Data as of May 2026. Plans and features may change.{" "}
            <a
              href="https://runwayml.com/pricing"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline hover:text-foreground"
            >
              Check Runway pricing
            </a>{" "}
            ·{" "}
            <Link href="/tools/kling" className="underline hover:text-foreground">
              Kling AI guide
            </Link>{" "}
            ·{" "}
            <Link href="/tools/pixverse" className="underline hover:text-foreground">
              PixVerse guide
            </Link>
          </p>
        </section>

        {/* How To */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            How to Use Runway Gen-3: Step-by-Step
          </h2>
          <ol className="space-y-3 text-muted">
            {[
              "Go to runwayml.com and create a free account (125 one-time credits).",
              'Select "Gen-3 Alpha" or "Gen-3 Alpha Turbo" from the model menu.',
              "Write a descriptive text prompt, focusing on lighting, action, and camera style.",
              "Optionally upload a reference image for image-to-video generation.",
              "Set video duration (up to 16 seconds) and aspect ratio, then click Generate.",
              "Download your video or share it on AIARKLIVE!",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
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
            Share Your Runway Video
          </h2>
          <p className="mb-6 text-muted">
            Made something with Runway Gen-3? Upload it to AIARKLIVE and get
            discovered by thousands of AI creators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/upload"
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-500"
            >
              Upload your Runway video
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
