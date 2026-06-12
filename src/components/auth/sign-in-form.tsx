"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address." }),
  password: z.string().min(1, { message: "Enter your password." }),
});

type SignInFormProps = {
  callbackUrl: string;
  defaultEmail?: string;
  successMessage?: string;
};

export function SignInForm({
  callbackUrl,
  defaultEmail = "",
  successMessage,
}: SignInFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);

  const infoMessage = useMemo(
    () => successMessage ?? "Use your email/password or GitHub account to continue.",
    [successMessage],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
        <p className="text-sm text-muted-foreground">{infoMessage}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={() => {
          startTransition(() => {
            void signIn("github", { callbackUrl });
          });
        }}
        disabled={isPending}
      >
        Sign in with GitHub
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            or continue with email
          </span>
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setFormError(null);
          setFieldErrors({});

          const parsed = signInSchema.safeParse({ email, password });

          if (!parsed.success) {
            const issues = parsed.error.flatten().fieldErrors;
            setFieldErrors({
              email: issues.email?.[0],
              password: issues.password?.[0],
            });
            return;
          }

          startTransition(async () => {
            const response = await signIn("credentials", {
              redirect: false,
              email: parsed.data.email,
              password: parsed.data.password,
              callbackUrl,
            });

            if (!response?.ok) {
              setFormError("Sign in failed. Check your email and password.");
              return;
            }

            router.push(response.url ?? callbackUrl);
          });
        }}
      >
        <label className="space-y-2">
          <span className="text-sm font-medium">Email</span>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          {fieldErrors.email ? (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Password</span>
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
          />
          {fieldErrors.password ? (
            <p className="text-xs text-destructive">{fieldErrors.password}</p>
          ) : null}
        </label>

        {formError ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="submit" className="w-full gap-2" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Need an account?{" "}
        <Link href="/register" className="font-medium text-foreground hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
