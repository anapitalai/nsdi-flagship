"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { UserPlus } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Enter your name." }),
    email: z.string().trim().email({ message: "Enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormProps = {
  callbackUrl?: string;
};

export function RegisterForm({ callbackUrl = "/sign-in" }: RegisterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          Register with your name, email, and password to access NSDI.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setFormError(null);
          setFieldErrors({});

          const parsed = registerSchema.safeParse({
            name,
            email,
            password,
            confirmPassword,
          });

          if (!parsed.success) {
            const issues = parsed.error.flatten().fieldErrors;
            setFieldErrors({
              name: issues.name?.[0],
              email: issues.email?.[0],
              password: issues.password?.[0],
              confirmPassword: issues.confirmPassword?.[0],
            });
            return;
          }

          startTransition(async () => {
            const response = await fetch("/api/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(parsed.data),
            });

            const data = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;

            if (!response.ok) {
              setFormError(data?.error ?? "Registration failed.");
              return;
            }

            router.push(`${callbackUrl}?registered=1&email=${encodeURIComponent(parsed.data.email)}`);
          });
        }}
      >
        <label className="space-y-2">
          <span className="text-sm font-medium">Name</span>
          <Input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
          />
          {fieldErrors.name ? <p className="text-xs text-destructive">{fieldErrors.name}</p> : null}
        </label>

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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
          />
          {fieldErrors.password ? (
            <p className="text-xs text-destructive">{fieldErrors.password}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Confirm password</span>
          <Input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your password"
          />
          {fieldErrors.confirmPassword ? (
            <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
          ) : null}
        </label>

        {formError ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="submit" className="w-full gap-2" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
          <UserPlus className="size-4" />
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={callbackUrl} className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
