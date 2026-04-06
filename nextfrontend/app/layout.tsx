import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import PrimarySearchAppBar from "./components/navbar";
import Footer from "./components/footer";
import { getUserId } from "./lib/actions";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Modern Ecommerce",
  description: "Experience the future of shopping",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getUserId();

  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-background text-foreground min-h-screen flex flex-col`}>
        <PrimarySearchAppBar userId={userId} />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <div className="fixed bottom-0 left-0 w-full border-t border-amber-300/60 bg-[linear-gradient(90deg,#f8dfab,#f6edd6,#f8dfab)] text-center py-2 text-[11px] font-semibold tracking-[0.18em] text-slate-900 z-[9999] shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
          STUDENT PROJECT SHOWCASE. DO NOT USE REAL PAYMENT INFORMATION.
        </div>
      </body>
    </html>
  );
}
