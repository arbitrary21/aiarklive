import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-muted">Page not found.</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-brand-500 px-6 py-3 text-white transition hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
