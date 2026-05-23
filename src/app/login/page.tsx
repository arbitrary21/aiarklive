import Link from "next/link";
import { AuthButton } from "@/components/auth/AuthButton";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";

export const metadata = {
  title: "Sign in",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string; reason?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next = "/", error, reason } = await searchParams;

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-foreground">Welcome to {SITE_NAME}</h1>
      <p className="mt-3 text-sm text-muted">
        Sign in with Google to upload videos, build your profile, and follow
        creators. New users are registered automatically on first sign-in.
      </p>
      <p className="mt-3 rounded-xl border px-4 py-3 text-left text-xs leading-relaxed text-muted"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="font-medium text-foreground">YouTube channel owners:</span>{" "}
        If you uploaded with a channel brand account but want to use your personal
        Gmail instead, sign in with that Gmail, then go to{" "}
        <strong className="text-foreground">Upload → Connect YouTube channel</strong>.
        Same channel will merge your previous videos into this login.
      </p>

      {!configured && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Auth is not configured on this deployment. Add{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in
          Cloudflare Pages, then redeploy.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Sign in failed. Check Google OAuth settings in Supabase and try again.
          {reason ? (
            <span className="mt-2 block text-xs opacity-80">{decodeURIComponent(reason)}</span>
          ) : null}
        </p>
      )}

      <div className="mt-8">
        <AuthButton nextPath={next} />
      </div>

      <Link href="/" className="mt-6 text-sm text-muted transition hover:text-foreground">
        Continue without signing in
      </Link>
    </div>
  );
}
