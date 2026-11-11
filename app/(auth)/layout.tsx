import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import Logo from "@/components/Logo";
import { getAuth } from "@/lib/better-auth/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers(); // read first so the route is always dynamic
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (session?.user) redirect("/");

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <section className="flex flex-col px-4 py-8 lg:w-[45%] lg:px-16 lg:py-10">
        <Logo />
        <div className="flex flex-1 items-center pt-10 pb-6 lg:pt-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </section>
      <section className="relative flex flex-col justify-center gap-10 bg-gray-800 px-6 py-12 lg:w-[55%] lg:px-20">
        <blockquote className="max-w-xl">
          <p className="text-xl text-gray-400 lg:text-2xl">
            &ldquo;Signalist turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market.&rdquo;
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <cite className="not-italic font-bold text-white">- Ethan R.</cite>
              <p className="text-sm text-gray-500">Retail Investor</p>
            </div>
            <div className="flex gap-1" aria-label="5 out of 5 stars">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
            </div>
          </div>
        </blockquote>
        <div className="hidden rounded-xl border border-gray-600 bg-gray-900 p-6 lg:block" aria-hidden="true">
          <svg viewBox="0 0 400 140" className="w-full">
            <polyline fill="none" stroke="#0FEDBE" strokeWidth="3" points="0,120 40,100 80,110 120,70 160,85 200,50 240,65 280,30 320,45 360,15 400,25" />
          </svg>
        </div>
      </section>
    </main>
  );
}
