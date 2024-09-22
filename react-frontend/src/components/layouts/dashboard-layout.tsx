import { useAuthLogged } from "@/features/authentication/auth-context";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import UserAvatar from "@/features/users/components/user-avatar";
import LogoutButton from "@/features/authentication/components/logout-button";
import { cn } from "@/lib/utils";
import { MenuIcon, SearchIcon, UsersIcon } from "lucide-react";
import { useFriendshipRequests } from "@/features/friendship/hooks/use-friendship-requests";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import SocketEvents from "../socket-events";
import { ThemeToggle } from "../theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import useGetConversations from "@/features/conversations/hooks/use-get-conversations";
import { useState } from "react";
import ConversationNavItem from "@/features/conversations/components/conversation-nav-item";

function NavLink({ children, to }: { children: React.ReactNode; to: string }) {
  const isCurrent = useLocation().pathname.includes(to);

  return (
    <Link
      to={to}
      className={cn("px-4 py-2 bg-transparent rounded-lg", {
        "bg-accent text-accent-foreground": isCurrent,
      })}
    >
      {children}
    </Link>
  );
}

function SideBar() {
  const [search, setSearch] = useState("");
  const { currentUser } = useAuthLogged();
  const { data: friendshipRequests } = useFriendshipRequests();
  const pendingRequests = friendshipRequests?.filter(
    (req) => req.status === "pending"
  );
  const { data: conversations } = useGetConversations();

  const filteredConversations = conversations
    ? conversations.filter(
        (conversation) =>
          conversation.friend.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          conversation.friend.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="space-y-3 p-2 mb-5">
        <div className="flex items-center justify-between">
          <UserAvatar user={currentUser} />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
        <div>
          <h2 className="font-medium">{currentUser.name}</h2>
          <p>{currentUser.email}</p>
        </div>
      </header>
      <nav className="grid gap-3">
        <NavLink to="/friendships">
          <div className="flex items-center gap-3">
            <UsersIcon className="w-[1.2rem] h-[1.2rem]" />
            <span>Friends</span>

            {pendingRequests && pendingRequests.length > 0 && (
              <span className="ml-auto text-sm">{pendingRequests.length}</span>
            )}
          </div>
        </NavLink>
        <div className="relative">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            placeholder="Search for a conversation..."
          />
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <SearchIcon className="w-[1.2rem] h-[1.2rem]" />
            <span className="sr-only">Search</span>
          </div>
        </div>
        {filteredConversations.length > 0 && (
          <ol className="grid gap-3">
            {filteredConversations.map((conversation) => (
              <li key={conversation.id}>
                <ConversationNavItem conversation={conversation} />
              </li>
            ))}
          </ol>
        )}
      </nav>
    </>
  );
}

export default function DashboardLayout() {
  const pathname = useLocation().pathname;

  const { currentUser } = useAuthLogged();

  if (pathname === "/") {
    return <Navigate to="/friendships" />;
  }

  return (
    <div className="min-h-svh flex flex-col lg:p-5 lg:grid lg:grid-cols-[300px_1fr] lg:gap-5">
      <SocketEvents />
      <header className="flex lg:hidden items-center justify-between bg-background px-4 py-3 drop-shadow-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon className="w-[1.2rem] h-[1.2rem]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pt-12">
            <SheetHeader className="text-left hidden">
              <SheetTitle>Chat Application</SheetTitle>
              <SheetDescription>
                This is a side menu for the app
              </SheetDescription>
            </SheetHeader>
            <SideBar />
          </SheetContent>
        </Sheet>
        <UserAvatar user={currentUser} />
      </header>
      <aside className="hidden lg:block">
        <SideBar />
      </aside>
      <main className="flex-1 flex flex-col lg:rounded-lg bg-background-tint max-h-[calc(100svh-4rem)] sm:max-h-[calc(100svh-2.5rem)]">
        <Outlet />
      </main>
    </div>
  );
}
