"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type SignOutButtonProps = {
  callbackUrl?: string;
  className?: string;
  children?: ReactNode;
};

export function SignOutButton({
  callbackUrl = "/sign-in",
  className,
  children = "Sign out",
}: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      className={className}
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          void signOut({ callbackUrl });
        });
      }}
    >
      {isPending ? "Signing out..." : children}
    </Button>
  );
}
