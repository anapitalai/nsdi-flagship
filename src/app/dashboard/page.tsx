import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
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
          <Button size="lg" className="h-10 sm:w-auto">
            New Item
          </Button>
        </header>

        <section className="grid min-h-[calc(100vh-11rem)] gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-xl font-semibold tracking-tight">Sidebar</h2>
          </aside>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-xl font-semibold tracking-tight">Main</h2>
          </div>
        </section>
      </div>
    </main>
  );
}
