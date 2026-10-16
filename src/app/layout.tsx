import type { Metadata, Viewport } from "next";
import { archivo } from "./fonts";
import "./globals.css";
import { Providers } from "@/components/motion/Providers";
import { PreviewBadge } from "@/components/ui/PreviewBadge";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3002"),
  ),
  title: "American Underdeck Systems — Website concept (unofficial)",
  description:
    "Turn the space beneath your deck into dry, finished outdoor living. Unofficial website concept for American Underdeck Systems (Marietta, Georgia), created as a design demonstration.",
  openGraph: {
    title: "American Underdeck Systems",
    description: "Reimagine the space beneath your deck.",
    // Resolved against metadataBase, which already includes the Pages path.
    images: ["/images/projects/lakeside-terrace.jpg"],
    type: "website",
  },
  robots: { index: false, follow: false }, // demo build
};

export const viewport: Viewport = {
  themeColor: "#0b1e33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-fg"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <PreviewBadge />
      </body>
    </html>
  );
}
