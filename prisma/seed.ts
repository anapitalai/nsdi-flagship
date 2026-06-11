import bcrypt from "bcryptjs";
import { PrismaClient, AssetCategory, AssetContentType } from "@prisma/client";

const prisma = new PrismaClient();

const SYSTEM_TYPES: Array<{ name: string; icon: string; color: string; category: AssetCategory }> = [
  { name: "snippet", icon: "Code", color: "#3b82f6", category: "reference" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6", category: "ai_ml" },
  { name: "command", icon: "Terminal", color: "#f97316", category: "reference" },
  { name: "note", icon: "StickyNote", color: "#fde047", category: "reference" },
  { name: "file", icon: "File", color: "#6b7280", category: "reference" },
  { name: "image", icon: "Image", color: "#ec4899", category: "reference" },
  { name: "link", icon: "Link", color: "#10b981", category: "reference" },
];

type SeedAsset = {
  title: string;
  description?: string;
  typeName: string;
  contentType: AssetContentType;
  content?: string;
  url?: string;
  fileFormat?: string;
};

type SeedCollection = {
  name: string;
  description: string;
  assets: SeedAsset[];
};

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    assets: [
      {
        title: "Custom Hooks Toolkit",
        description: "A practical set of hooks including useDebounce and useLocalStorage.",
        typeName: "snippet",
        contentType: "content",
        fileFormat: "TypeScript",
        content: "export function useDebounce<T>(value: T, delay = 250): T {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const handle = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(handle);\n  }, [value, delay]);\n  return debounced;\n}",
      },
      {
        title: "Context + Compound Components",
        description: "Pattern for flexible APIs with controlled shared state.",
        typeName: "snippet",
        contentType: "content",
        fileFormat: "TypeScript",
        content: "const TabsContext = createContext<{ value: string; setValue: (v: string) => void } | null>(null);\n\nexport function Tabs({ children }: { children: ReactNode }) {\n  const [value, setValue] = useState('overview');\n  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;\n}",
      },
      {
        title: "Utility Function Patterns",
        description: "Small pure functions for reusable transformations.",
        typeName: "snippet",
        contentType: "content",
        fileFormat: "TypeScript",
        content: "export function groupBy<T, K extends string>(items: T[], keyOf: (item: T) => K): Record<K, T[]> {\n  return items.reduce((acc, item) => {\n    const key = keyOf(item);\n    (acc[key] ||= []).push(item);\n    return acc;\n  }, {} as Record<K, T[]>);\n}",
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    assets: [
      {
        title: "Code Review Prompt",
        typeName: "prompt",
        contentType: "content",
        content: "Review this pull request for correctness, regressions, and missing tests. Return high-severity issues first.",
      },
      {
        title: "Documentation Generator Prompt",
        typeName: "prompt",
        contentType: "content",
        content: "Generate concise docs for this module: public API, examples, and edge cases.",
      },
      {
        title: "Refactoring Assistant Prompt",
        typeName: "prompt",
        contentType: "content",
        content: "Refactor this function for readability and testability while preserving behavior.",
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    assets: [
      {
        title: "Docker Multi-Stage Build Snippet",
        typeName: "snippet",
        contentType: "content",
        fileFormat: "Dockerfile",
        content: "FROM node:20-alpine AS deps\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\n\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nRUN npm run build",
      },
      {
        title: "Deploy Script Command",
        typeName: "command",
        contentType: "content",
        content: "docker compose pull && docker compose up -d --remove-orphans",
      },
      {
        title: "GitHub Actions Docs",
        typeName: "link",
        contentType: "url",
        url: "https://docs.github.com/actions",
      },
      {
        title: "Docker Compose Reference",
        typeName: "link",
        contentType: "url",
        url: "https://docs.docker.com/compose/",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    assets: [
      {
        title: "Git Cleanup",
        typeName: "command",
        contentType: "content",
        content: "git fetch --prune && git branch --merged | grep -v '\\*\\|main' | xargs -r git branch -d",
      },
      {
        title: "Docker Logs",
        typeName: "command",
        contentType: "content",
        content: "docker compose logs -f --tail=200",
      },
      {
        title: "Process Discovery",
        typeName: "command",
        contentType: "content",
        content: "lsof -i :3000",
      },
      {
        title: "Package Manager Audit",
        typeName: "command",
        contentType: "content",
        content: "npm audit --production",
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    assets: [
      {
        title: "Tailwind CSS Docs",
        typeName: "link",
        contentType: "url",
        url: "https://tailwindcss.com/docs",
      },
      {
        title: "shadcn/ui Components",
        typeName: "link",
        contentType: "url",
        url: "https://ui.shadcn.com/docs/components",
      },
      {
        title: "Material Design 3",
        typeName: "link",
        contentType: "url",
        url: "https://m3.material.io/",
      },
      {
        title: "Lucide Icons",
        typeName: "link",
        contentType: "url",
        url: "https://lucide.dev/icons/",
      },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {
      name: "Demo User",
      passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  const typeMap = new Map<string, string>();

  for (const type of SYSTEM_TYPES) {
    const createdType = await prisma.assetType.upsert({
      where: { slug: type.name },
      update: {
        name: type.name,
        icon: type.icon,
        color: type.color,
        category: type.category,
        isSystem: true,
      },
      create: {
        name: type.name,
        slug: type.name,
        icon: type.icon,
        color: type.color,
        category: type.category,
        isSystem: true,
      },
    });

    typeMap.set(type.name, createdType.id);
  }

  for (const seedCollection of COLLECTIONS) {
    const defaultTypeName = seedCollection.assets[0]?.typeName ?? "note";
    const defaultTypeId = typeMap.get(defaultTypeName);
    if (!defaultTypeId) {
      throw new Error(`Missing default type for collection: ${seedCollection.name}`);
    }

    const collection = await prisma.collection.upsert({
      where: { userId_name: { userId: user.id, name: seedCollection.name } },
      update: {
        description: seedCollection.description,
        defaultTypeId,
      },
      create: {
        userId: user.id,
        name: seedCollection.name,
        description: seedCollection.description,
        defaultTypeId,
      },
    });

    for (const seedAsset of seedCollection.assets) {
      const assetTypeId = typeMap.get(seedAsset.typeName);
      if (!assetTypeId) {
        throw new Error(`Missing asset type: ${seedAsset.typeName}`);
      }

      const asset = await prisma.asset.upsert({
        where: { userId_title: { userId: user.id, title: seedAsset.title } },
        update: {
          description: seedAsset.description,
          assetTypeId,
          contentType: seedAsset.contentType,
          content: seedAsset.content,
          url: seedAsset.url,
          fileFormat: seedAsset.fileFormat,
        },
        create: {
          userId: user.id,
          title: seedAsset.title,
          description: seedAsset.description,
          assetTypeId,
          contentType: seedAsset.contentType,
          content: seedAsset.content,
          url: seedAsset.url,
          fileFormat: seedAsset.fileFormat,
        },
      });

      await prisma.assetCollection.upsert({
        where: {
          assetId_collectionId: {
            assetId: asset.id,
            collectionId: collection.id,
          },
        },
        update: {},
        create: {
          assetId: asset.id,
          collectionId: collection.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
