import Link from "next/link";
import { AuthButton } from "@/components/auth/AuthButton";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";

export const metadata = {
  title: "Sign in",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next = "/", error } = await searchParams;

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
