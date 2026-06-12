import { auth } from "@/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
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

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  const callbackUrl = resolveCallbackUrl(firstValue(searchParams?.callbackUrl), "/sign-in");

  return (
    <AuthShell
      badge="Create Account"
      title="Register for a new NSDI workspace."
      description="Create your account with a name, email address, and password so you can start signing in across the platform."
      points={[
        "Email/password registration backed by bcrypt hashing",
        "GitHub login remains available after registration",
        "Redirects back to sign-in when the account is created",
      ]}
    >
      <RegisterForm callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
