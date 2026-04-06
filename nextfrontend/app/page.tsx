import ProductList from "./components/home/ProductList";
import Link from "next/link";
import { ArrowForward, SouthEast, Storefront } from "@mui/icons-material";

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f5ee_0%,#ffffff_35%,#ffffff_100%)] pb-20">
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[-8%] top-10 h-48 w-48 rounded-full bg-orange-200/40 blur-3xl" />
          <div className="absolute right-[8%] top-24 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-40 w-[32rem] -translate-x-1/2 rounded-full bg-amber-100/50 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:px-8 lg:py-24">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-slate-700 backdrop-blur">
              <Storefront fontSize="small" />
              Modern Marketplace
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-slate-950 md:text-7xl">
              A sharper way
              <br />
              to shop everyday essentials.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Explore practical tech, clean wardrobe staples, and home upgrades in one place.
              No oversized banner, no filler, just a storefront built to get you to the right products faster.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/categories/?name=All"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <span>Browse all products</span>
                <ArrowForward fontSize="small" />
              </Link>
              <Link
                href="/categories/?name=Electronics"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <span>Start with electronics</span>
                <SouthEast fontSize="small" />
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-black/10 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Curation</p>
                <p className="mt-3 text-2xl font-black text-slate-950">3</p>
                <p className="mt-2 text-sm text-slate-600">Focused collections: electronics, clothing, and home essentials.</p>
              </div>
              <div className="rounded-[1.75rem] border border-black/10 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Storefront</p>
                <p className="mt-3 text-2xl font-black text-slate-950">Fast</p>
                <p className="mt-2 text-sm text-slate-600">Built around quick scanning, horizontal discovery, and direct category entry points.</p>
              </div>
              <div className="rounded-[1.75rem] border border-black/10 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-300">This season</p>
                <p className="mt-3 text-2xl font-black">Utility over noise</p>
                <p className="mt-2 text-sm text-slate-300">Better basics, better gear, and fewer distractions on the way in.</p>
              </div>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 lg:pl-4">
            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-black/10 bg-[#111827] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">Daily Edit</p>
                <h2 className="mt-4 text-2xl font-black leading-tight">
                  Built for people who know what they want.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Jump into top categories, compare items quickly, and move from landing page to product grid without a giant promotional image slowing the page down.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Link
                  href="/categories/?name=Clothing"
                  className="rounded-[1.75rem] border border-black/10 bg-[#f4efe6] p-6 transition hover:-translate-y-1"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Category</p>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950">Clothing</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Refined staples and everyday layers.</p>
                    </div>
                    <SouthEast className="text-slate-700" />
                  </div>
                </Link>

                <Link
                  href="/categories/?name=Home%20%26%20Kitchen"
                  className="rounded-[1.75rem] border border-black/10 bg-[#eef6f7] p-6 transition hover:-translate-y-1"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Category</p>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950">Home & Kitchen</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Practical upgrades for the spaces you use most.</p>
                    </div>
                    <SouthEast className="text-slate-700" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-12 mt-12">
        <ProductList title="Latest Electronics" category="Electronics" />
        <ProductList title="Trending Clothing" category="Clothing" />
        <ProductList title="Home & Kitchen Essentials" category="Home & Kitchen" />
      </div>

    </div>
  );
}
