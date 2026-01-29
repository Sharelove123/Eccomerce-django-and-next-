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
      </body>
    </html>
  );
}
