import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/auth-context";
import { Footer} from "@/components/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://credisense.com"), // Replace if your domain differs.
  title: {
    default: "CrediSense | AI Credit Risk Assessment",
    template: "%s | CrediSense",
  },
  description:
    "Assess credit risk with AI-powered insights. CrediSense helps lending organizations make more informed, data-driven assessments.",
  applicationName: "CrediSense",
  openGraph: {
    title: "CrediSense | AI Credit Risk Assessment",
    description:
      "AI-powered credit risk insights for more informed lending assessments.",
    siteName: "CrediSense",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>{children}</AuthProvider>
        <Footer/>
      </body>

    </html>
  );
}
