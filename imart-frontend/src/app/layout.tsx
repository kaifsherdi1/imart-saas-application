import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./providers";
import Header from "./components/Header";
import AuthRedirectHandler from "./components/AuthRedirectHandler";
import SmoothScroll from "./components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "iMart | Premium Multi-tenant SaaS",
  description: "Advanced e-commerce platform for modern retailers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${inter.variable} font-sans min-h-full flex flex-col bg-background text-foreground`}>
        <ReduxProvider>
          <AuthRedirectHandler />
          <SmoothScroll>
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </SmoothScroll>
        </ReduxProvider>
      </body>
    </html>
  );
}

