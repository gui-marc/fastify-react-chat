import { useAuthLogged } from "@/features/authentication/auth-context";
import { Link, Outlet, useLocation } from "react-router-dom";
import UserAvatar from "../user-avatar";
import LogoutButton from "@/features/authentication/components/logout-button";
import { cn } from "@/lib/utils";
import { UsersIcon } from "lucide-react";
import { useFriendshipRequests } from "@/features/friendship/hooks/use-friendship-requests";

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

export default function DashboardLayout() {
  const { currentUser } = useAuthLogged();

  const { data: friendshipRequests } = useFriendshipRequests();

  const pendingRequests = friendshipRequests?.filter(
    (req) => req.status === "pending"
  );

  return (
    <div className="h-svh p-5 grid grid-cols-[300px_1fr] gap-5">
      <aside>
        <header className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <UserAvatar user={currentUser} />
            <LogoutButton />
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
                <span className="ml-auto text-sm">
                  {pendingRequests.length}
                </span>
              )}
            </div>
          </NavLink>
        </nav>
      </aside>
      <main className="rounded-lg bg-background-tint">
        <Outlet />
      </main>
    </div>
  );
}
