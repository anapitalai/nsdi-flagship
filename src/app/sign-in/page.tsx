import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function resolveCallbackUrl(value: string | undefined, fallback: string): string {
  if (!value || !value.startsWith("/")) {
    return fallback;
  }

  return value;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  const callbackUrl = resolveCallbackUrl(firstValue(searchParams?.callbackUrl), "/dashboard");
  const defaultEmail = firstValue(searchParams?.email) ?? "";
  const successMessage =
    searchParams?.registered === "1"
      ? "Account created. Sign in to continue."
      : undefined;

  return (
    <AuthShell
      badge="NSDI Access"
      title="Sign in to your spatial data workspace."
      description="Use your GitHub account or email and password to access NSDI, manage assets, and keep your workflows connected."
      points={[
        "Custom login UI with GitHub OAuth and password sign-in",
        "Protected dashboard access with session-aware redirects",
        "Consistent account experience across sign-in, register, and profile",
      ]}
    >
      <SignInForm
        callbackUrl={callbackUrl}
        defaultEmail={defaultEmail}
        successMessage={successMessage}
      />
    </AuthShell>
  );
}
