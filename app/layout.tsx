import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Analytics Dashboard",
  description: "by Fidan Khalilova",
};

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/compare", label: "Waterfall vs parallel" },
  { href: "/slots", label: "Parallel routes" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="flex items-center gap-6 border-b bg-white px-6 py-4">
          <span className="text-lg font-bold">Analytics</span>
          <nav className="flex gap-4 text-sm text-blue-600">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="late-banner ml-auto rounded bg-amber-100 px-3 py-1 text-sm text-amber-800">
            Still loading…
          </span>
        </header>
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
