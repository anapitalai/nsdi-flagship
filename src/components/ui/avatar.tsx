"use client";

/* eslint-disable @next/next/no-img-element */

import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  imageUrl?: string | null;
  sizeClassName?: string;
};

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "?";
}

function Avatar({ name, imageUrl, sizeClassName = "size-11", className, ...props }: AvatarProps) {
  const sharedClasses = cn(
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted/70 text-sm font-semibold text-foreground",
    sizeClassName,
    className,
  );

  if (imageUrl) {
    return (
      <div className={sharedClasses} {...props}>
        <img
          src={imageUrl}
          alt={`${name} avatar`}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={sharedClasses} {...props}>
      {getInitials(name)}
    </div>
  );
}

export { Avatar, getInitials };
