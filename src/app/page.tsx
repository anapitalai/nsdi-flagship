import Link from "next/link";
import {
  ArrowRight,
  Database,
  Layers3,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    title: "Search spatial assets fast",
    description:
      "Discover datasets, uploads, references, and derived products from one national registry.",
    icon: Search,
  },
  {
    title: "Track data lineage",
    description:
      "Keep file origin, storage location, and asset metadata connected for reproducible workflows.",
    icon: Layers3,
  },
  {
    title: "Keep storage private",
    description:
      "Serve object storage through controlled routes and signed access patterns when needed.",
    icon: ShieldCheck,
  },
];

const coveragePoints = [
  "Vector datasets",
  "Raster imagery",
  "LiDAR and point clouds",
  "GNSS and survey files",
  "AI training data",
  "Metadata and CRS definitions",
];

const stats = [
  { value: "1", label: "central registry" },
  { value: "24/7", label: "asset access" },
  { value: "100%", label: "server-side storage control" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col justify-center gap-8">
        <section className="grid gap-8 overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-2xl shadow-black/10 backdrop-blur sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="size-3.5" />
              National Spatial Data Infrastructure
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                A single home for spatial data, metadata, and workflow assets.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                NSDI helps teams store, discover, and govern datasets across the full
                lifecycle, from field capture to analysis-ready products, without losing
                lineage or context.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open dashboard
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#coverage"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                View coverage
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-muted/30 p-4"
                >
                  <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="grid gap-4 rounded-2xl border border-border bg-background/70 p-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Database className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Central asset registry</p>
                <p className="text-sm text-muted-foreground">
                  Browse live bucket assets and structured records in one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <MapPinned className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Spatial discovery</p>
                <p className="text-sm text-muted-foreground">
                  Designed for geospatial teams, survey workflows, and AI-ready archives.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-medium">Supported coverage</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {coveragePoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section
          id="coverage"
          className="grid gap-4 sm:grid-cols-3"
        >
          {highlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <article
                key={highlight.title}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/20"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-lg font-semibold">{highlight.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {highlight.description}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
