import { redirect } from "next/navigation";
import { UsernameSetupForm } from "@/components/auth/UsernameSetupForm";
import { getCurrentUser, getUsernameSetupState } from "@/lib/auth";

export const runtime = "edge";

export const metadata = {
  title: "Choose your nickname",
};

interface WelcomePageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function WelcomePage({ searchParams }: WelcomePageProps) {
  const { next = "/" } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/welcome")}`);
  }

  const setup = await getUsernameSetupState();
  if (!setup?.needsSetup) {
    redirect(next);
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center py-8">
      <UsernameSetupForm
        suggestedUsername={setup.suggestedUsername}
        nextPath={next}
      />
    </div>
  );
}
