import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrimarySearchAppBar from "./components/navbar";
import Footer from "./components/footer";
import { getUserId } from "./lib/actions";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <PrimarySearchAppBar userId={userId} />
        <main className="flex-grow pt-20">
            {/* pt-20 to account for fixed navbar */}
            {children}
        </main>
        <Footer />
        <div className="fixed bottom-0 left-0 w-full bg-yellow-400 text-black text-center py-2 text-sm font-bold z-[9999] shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
          ⚠️ STUDENT PROJECT SHOWCASE: This is not a real store. Please do not make any real purchases or enter actual payment information.
        </div>
      </body>
    </html>
  );
}
