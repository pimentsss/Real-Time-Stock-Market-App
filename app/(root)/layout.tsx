import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { getAuth } from "@/lib/better-auth/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers(); // read first so the route is always dynamic
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user) redirect("/sign-in");

  const user = { id: session.user.id, name: session.user.name, email: session.user.email };

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
}
