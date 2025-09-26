import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ETickets Dashboard",
  description: "Professional event ticketing management system with role-based access control",
  keywords: ["ETickets", "Event Management", "Ticketing", "Dashboard", "Next.js", "TypeScript"],
  authors: [{ name: "ETickets Team" }],
  openGraph: {
    title: "ETickets Dashboard",
    description: "Professional event ticketing management system",
    url: "https://etickets.com",
    siteName: "ETickets",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ETickets Dashboard",
    description: "Professional event ticketing management system",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
