import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nexus",
    default: "Nexus - Connect. Code. Create.",
  },
  description: "A developer-focused collaborative pre-production platform powered by AI",
  keywords: ["collaboration", "development", "AI", "pre-production", "developers"],
  authors: [{ name: "Nexus Team" }],
  creator: "Nexus",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Nexus - Connect. Code. Create.",
    description: "A developer-focused collaborative pre-production platform",
    siteName: "Nexus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus - Connect. Code. Create.",
    description: "A developer-focused collaborative pre-production platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}