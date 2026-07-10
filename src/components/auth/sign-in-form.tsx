"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { FormEvent } from "react";
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
  const isDevelopment = process.env.NODE_ENV !== "production";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);

  const infoMessage = useMemo(
    () => successMessage ?? "Use your email/password or GitHub account to continue.",
    [successMessage],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        email: issues.email?.[0],
        password: issues.password?.[0],
      });
      return;
    }

    startTransition(async () => {
      try {
        console.info("[auth][client] submitting", {
          email: parsed.data.email,
          passwordLength: parsed.data.password.length,
          callbackUrl,
        });

        const response = await signIn("credentials", {
          redirect: false,
          email: parsed.data.email,
          password: parsed.data.password,
          redirectTo: callbackUrl,
        });

        if (!response || response.error) {
          const message = isDevelopment
            ? `Sign in failed (${response?.error ?? "unknown"}). Check your email and password.`
            : "Sign in failed. Check your email and password.";
          setFormError(message);
          console.warn("[auth][client]", {
            response,
            email: parsed.data.email,
            callbackUrl,
          });
          return;
        }

        router.push(response.url ?? callbackUrl);
      } catch (error) {
        const message = isDevelopment
          ? "Sign in request failed to reach the server. Refresh the page and try again."
          : "Sign in is temporarily unavailable. Refresh the page and try again.";
        setFormError(message);
        console.error("[auth][client][fetch-failed]", {
          error,
          email: parsed.data.email,
          callbackUrl,
        });
      }
    });
  }

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
            void signIn("github", { redirectTo: callbackUrl });
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
        onSubmit={handleSubmit}
      >
        <label className="space-y-2">
          <span className="text-sm font-medium">Email</span>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={defaultEmail}
            placeholder="you@example.com"
          />
          {fieldErrors.email ? (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Password</span>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
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
