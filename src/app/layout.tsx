import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Rethink_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Tenant Platform",
  description: "Modern Landlord & Tenant Management Prototype",
};

const rethink = Rethink_Sans({
  subsets: ["latin"],
  variable: "--font-rethink"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${rethink.variable}`} suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
