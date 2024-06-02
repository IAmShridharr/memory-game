import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memory Game",
  description: "Classic Memory Game built in NextJS with TailwindCSS",
  keywords: "memory game, nextjs, tailwindcss, classic game, card matching game",
  authors: [{ name: "Shridhar Pandey" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
