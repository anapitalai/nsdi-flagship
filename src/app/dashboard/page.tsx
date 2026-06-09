"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Clock3,
  Database,
  Folder,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  Shapes,
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

  const recentCollections = useMemo(
    () => [...dashboardMockData.collections].reverse(),
    []
  );
  const pinnedItems = useMemo(() => dashboardMockData.items.slice(0, 3), []);
  const recentItems = useMemo(
    () => [...dashboardMockData.items].reverse().slice(0, 10),
    []
  );
  const itemTypeById = useMemo(
    () =>
      dashboardMockData.itemTypes.reduce<Record<string, (typeof dashboardMockData.itemTypes)[number]>>(
        (accumulator, type) => {
          accumulator[type.id] = type;
          return accumulator;
        },
        {}
      ),
    []
  );

  const stats = [
    {
      label: "Items",
      value: dashboardMockData.items.length,
      icon: Database,
    },
    {
      label: "Collections",
      value: dashboardMockData.collections.length,
      icon: Folder,
    },
    {
      label: "Favorite Items",
      value: Math.min(3, dashboardMockData.items.length),
      icon: Star,
    },
    {
      label: "Favorite Collections",
      value: Math.min(2, dashboardMockData.collections.length),
      icon: Shapes,
    },
  ];

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

        <section className="grid min-h-[calc(100vh-11rem)] gap-6 lg:grid-cols-[auto_1fr]">
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
          <section className="space-y-6 rounded-xl border border-border bg-card p-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const StatIcon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <StatIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-lg border border-border p-4">
                <h2 className="mb-3 text-base font-semibold">Recent Collections</h2>
                <ul className="space-y-2">
                  {recentCollections.map((collection) => (
                    <li key={collection.id}>
                      <div className="rounded-md bg-muted/30 px-3 py-2">
                        <p className="truncate text-sm font-medium">{collection.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {collection.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-border p-4">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
                  <Pin className="size-4" /> Pinned Items
                </h2>
                <ul className="space-y-2">
                  {pinnedItems.map((item) => (
                    <li key={item.id}>
                      <div className="rounded-md bg-muted/30 px-3 py-2">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {itemTypeById[item.itemTypeId]?.name ?? "Unknown"} • {item.format}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="rounded-lg border border-border p-4">
              <h2 className="mb-3 text-base font-semibold">10 Recent Items</h2>
              <ul className="space-y-2">
                {recentItems.map((item) => (
                  <li key={item.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/30 px-3 py-2">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{itemTypeById[item.itemTypeId]?.name ?? "Unknown"}</span>
                        <span>•</span>
                        <span>{item.format}</span>
                        <span>•</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </section>
        </section>
      </div>

      {isMobileDrawerOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
          aria-label="Close sidebar backdrop"
        />
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
