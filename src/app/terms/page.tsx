import type { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Terms of Service | AIARKLIVE",
  description:
    "Read the AIARKLIVE Terms of Service. Learn about acceptable use, content policies, AI-generated content rules, and copyright guidelines for our platform.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 23, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16 pt-8">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Terms of Service
        </h1>
        <p className="text-sm text-muted">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-10 text-muted">

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using AIARKLIVE (&quot;the Service&quot;, &quot;we&quot;, &quot;our&quot;), you
            agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not
            agree, you may not access or use the Service.
          </p>
          <p>
            We reserve the right to update these Terms at any time. Continued
            use of the Service after any changes constitutes your acceptance of
            the revised Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p>
            AIARKLIVE is a community platform for sharing, discovering, and
            discussing AI-generated video content. Videos on AIARKLIVE are
            displayed exclusively via official platform embeds (YouTube, TikTok,
            X/Twitter). AIARKLIVE does not host or store video files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. User Accounts
          </h2>
          <p>
            You may sign in using Google OAuth. You are responsible for all
            activity under your account. You must not share your credentials
            or allow others to use your account.
          </p>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these Terms, without prior notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. Content Upload Policy
          </h2>
          <p>
            When you submit a video link to AIARKLIVE, you represent and warrant
            that:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              You own the content or have the necessary rights and permissions
              to distribute it via the platform where it is hosted.
            </li>
            <li>
              The content complies with the terms of service of the original
              hosting platform (e.g., YouTube&apos;s Terms of Service).
            </li>
            <li>
              If the video was generated using an AI tool (Kling, Runway,
              PixVerse, Pika, etc.), you have reviewed and comply with that
              tool&apos;s output licensing and distribution terms.
            </li>
            <li>
              The content does not infringe any third-party copyright,
              trademark, or other intellectual property rights.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. AI-Generated Content Disclosure
          </h2>
          <p>
            AIARKLIVE is a platform dedicated to AI-generated video content.
            When uploading, you are encouraged to disclose:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Whether the content was generated using an AI tool.
            </li>
            <li>
              Which AI tool(s) were used (Kling, Runway, PixVerse, etc.).
            </li>
          </ul>
          <p>
            You must not misrepresent AI-generated content as human-created
            content in a way that is deceptive or misleading.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. Prohibited Content
          </h2>
          <p>You may not upload, share, or promote content that:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Infringes any copyright, trademark, or intellectual property rights.</li>
            <li>Is sexually explicit, obscene, or contains NSFW material.</li>
            <li>Depicts or promotes violence, hate speech, or discrimination.</li>
            <li>Contains personally identifiable information about individuals without consent (deepfakes, non-consensual imagery).</li>
            <li>Violates any applicable law or regulation.</li>
            <li>Is spam, misleading, or fraudulent.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. No Downloads or Redistribution
          </h2>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="font-semibold text-amber-300 mb-2">Important Policy</p>
            <p>
              AIARKLIVE does not provide video download functionality for
              platform-hosted content (e.g., YouTube videos). Downloading,
              copying, or redistributing videos hosted on third-party platforms
              without authorization may violate:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The terms of service of the original hosting platform.</li>
              <li>The Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 1201.</li>
              <li>Applicable copyright law in your jurisdiction.</li>
            </ul>
          </div>
          <p>
            Thumbnail images may be downloaded for personal, non-commercial
            reference use only, as permitted by the thumbnail download feature.
          </p>
          <p>
            You may not use any content from AIARKLIVE for AI training datasets,
            scraping, or any automated collection purpose without our explicit
            written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            8. Intellectual Property
          </h2>
          <p>
            The AIARKLIVE platform, including its design, code, logos, and
            original content, is owned by AIARKLIVE and protected by applicable
            intellectual property laws.
          </p>
          <p>
            You retain ownership of any content you submit. By submitting
            content, you grant AIARKLIVE a non-exclusive, royalty-free license
            to display the content on the platform for the purpose of operating
            the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            9. User-Generated Content and Reports
          </h2>
          <p>
            AIARKLIVE does not pre-screen submitted content. We rely on our
            community to report policy violations. We will investigate reports
            and remove content that violates these Terms.
          </p>
          <p>
            To report a video, click the report button on any video page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            10. Disclaimer of Warranties
          </h2>
          <p>
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without any
            warranties of any kind, express or implied. AIARKLIVE does not
            guarantee that the Service will be uninterrupted, error-free, or
            free of harmful components.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            11. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, AIARKLIVE shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising out of your use of, or inability to use,
            the Service.
          </p>
          <p>
            AIARKLIVE is not responsible for the accuracy, legality, or
            appropriateness of AI tool outputs shared on the platform, or for
            any disputes between users and AI tool providers regarding
            licensing or IP rights.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            12. Governing Law
          </h2>
          <p>
            These Terms are governed by and construed in accordance with
            applicable law. Any disputes shall be resolved through good-faith
            negotiation or, if necessary, binding arbitration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            13. Contact
          </h2>
          <p>
            For questions about these Terms, please use the report feature
            within the platform or contact us through our community channels.
          </p>
        </section>

      </div>
    </div>
  );
}
