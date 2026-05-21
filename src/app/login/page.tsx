import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthButton } from "@/components/auth/AuthButton";

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

  if (!configured) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-foreground">Welcome to aiarklive</h1>
      <p className="mt-3 text-sm text-muted">
        Sign in with Google to upload videos, build your profile, and follow
        creators.
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Sign in failed. Please try again.
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
