"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronUp, LogOut, UserCircle2 } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/auth/sign-out-button";

type DashboardUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type UserMenuProps = {
  user: DashboardUser;
};

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-2">
        <Link
          href="/profile"
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          aria-label={`Open profile for ${user.name ?? "user"}`}
        >
          <Avatar name={user.name ?? "User"} imageUrl={user.image} sizeClassName="size-10" />
        </Link>

        <Link href="/profile" className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {user.name ?? "Signed in user"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user.email ?? "No email provided"}
          </p>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Toggle account menu"
          aria-expanded={isOpen}
        >
          <ChevronUp className={`size-4 transition-transform ${isOpen ? "" : "rotate-180"}`} />
        </button>
      </div>

      {isOpen ? (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <Link
            href="/profile"
            className="flex items-center gap-2 border-b border-border px-3 py-2 text-sm hover:bg-muted"
          >
            <UserCircle2 className="size-4 text-muted-foreground" />
            Profile
          </Link>
          <SignOutButton
            callbackUrl="/sign-in"
            className="flex w-full items-center justify-start gap-2 rounded-none px-3 py-2 text-sm hover:bg-muted"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </SignOutButton>
        </div>
      ) : null}
    </div>
  );
}
