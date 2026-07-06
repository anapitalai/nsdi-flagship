import type { Metadata } from "next";
import { NapitalaiICTCLogo } from "@/components/napitalai-ictc-logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "National Spatial Data Infrastructure",
  description: "NSDI",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "256x256" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "256x256" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <NapitalaiICTCLogo size={32} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
