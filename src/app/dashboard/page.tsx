"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Clock3,
  Folder,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Star,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dashboardMockData } from "@/lib/mock-data";

type SidebarContentProps = {
  compact?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
};

function SidebarContent({
  compact = false,
  onToggleCollapse,
  onCloseMobile,
}: SidebarContentProps) {
  const favoriteCollections = useMemo(
    () => dashboardMockData.collections.slice(0, 2),
    []
  );
  const recentCollections = useMemo(
    () => dashboardMockData.collections.slice(-3),
    []
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border p-3">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">
          {compact ? "NSDI" : "Dashboard"}
        </p>
        {onToggleCollapse ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
          >
            {compact ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        ) : null}
        {onCloseMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="space-y-6 overflow-y-auto p-3">
        <section className="space-y-2">
          {!compact ? (
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Item Types
            </h2>
          ) : null}
          <ul className="space-y-1">
            {dashboardMockData.itemTypes.map((type) => (
              <li key={type.id}>
                <Link
                  href={`/items/${type.slug}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: type.color }}
                    aria-hidden="true"
                  />
                  {compact ? null : <span>{type.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          {!compact ? (
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Star className="size-3.5" /> Favorite Collections
            </h2>
          ) : null}
          <ul className="space-y-1">
            {favoriteCollections.map((collection) => (
              <li key={collection.id}>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Folder className="size-4 text-muted-foreground" />
                  {compact ? null : <span className="truncate">{collection.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          {!compact ? (
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock3 className="size-3.5" /> Most Recent
            </h2>
          ) : null}
          <ul className="space-y-1">
            {recentCollections.map((collection) => (
              <li key={collection.id}>
                <Link
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Folder className="size-4 text-muted-foreground" />
                  {compact ? null : <span className="truncate">{collection.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-auto border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 p-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            {dashboardMockData.user.initials}
          </div>
          {compact ? null : (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{dashboardMockData.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {dashboardMockData.user.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:max-w-md">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden"
            >
              <Menu className="size-4" />
            </Button>
            <div className="relative w-full">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search"
              className="h-10 rounded-lg pl-9"
              aria-label="Search"
            />
            </div>
          </div>
          <Button size="lg" className="h-10 sm:w-auto">
            New Item
          </Button>
        </header>

        <section className="grid min-h-[calc(100vh-11rem)] gap-6 lg:grid-cols-[1fr_auto]">
          <aside
            className={`hidden overflow-hidden rounded-xl border border-border bg-card transition-[width] duration-300 lg:block ${
              isSidebarCollapsed ? "w-20" : "w-72"
            }`}
          >
            <SidebarContent
              compact={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
            />
          </aside>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-xl font-semibold tracking-tight">Main</h2>
          </div>
        </section>
      </div>

      {isMobileDrawerOpen ? (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" aria-hidden="true" />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-border bg-card shadow-xl transition-transform duration-300 lg:hidden ${
          isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile sidebar"
      >
        <SidebarContent onCloseMobile={() => setIsMobileDrawerOpen(false)} />
      </aside>
    </main>
  );
}
