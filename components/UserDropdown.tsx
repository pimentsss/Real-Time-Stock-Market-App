"use client";

import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import NavItems from "@/components/NavItems";
import { signOut } from "@/lib/actions/auth.actions";
import type { StockWithWatchlistStatus } from "@/lib/actions/finnhub.actions";

type User = { id: string; name: string; email: string };

const Avatar = ({ name, size = 8 }: { name: string; size?: number }) => (
  <span
    className="flex items-center justify-center rounded-full bg-yellow-500 font-bold text-gray-900"
    style={{ width: size * 4, height: size * 4 }}
  >
    {name?.[0]?.toUpperCase() ?? "?"}
  </span>
);

export default function UserDropdown({ user, initialStocks, watchlistSymbols }: { user: User; initialStocks: StockWithWatchlistStatus[]; watchlistSymbols: string[] }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex cursor-pointer items-center gap-3 rounded-full text-gray-400 hover:text-yellow-500" aria-label="Account menu">
          <Avatar name={user.name} />
          <span className="hidden text-base font-medium text-gray-400 md:block">{user.name}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="z-50 min-w-56 rounded-lg border border-gray-600 bg-gray-800 p-1 text-gray-400 shadow-lg">
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar name={user.name} size={10} />
            <div className="flex flex-col">
              <span className="font-medium text-gray-100">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-gray-600" />
          <DropdownMenu.Item
            onSelect={handleSignOut}
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-base font-medium outline-none data-[highlighted]:bg-gray-700 data-[highlighted]:text-yellow-500"
          >
            <LogOut className="h-4 w-4" /> Logout
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-gray-600 sm:hidden" />
          <nav className="sm:hidden">
            <NavItems initialStocks={initialStocks} watchlistSymbols={watchlistSymbols} />
          </nav>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
