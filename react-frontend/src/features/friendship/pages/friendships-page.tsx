import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoaderIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { Link, Navigate, Outlet, useMatch } from "react-router-dom";
import AddFriendDialog from "../components/add-friend-dialog";
import { useFriendshipRequests } from "../hooks/use-friendship-requests";
import { Suspense } from "react";

function Loading() {
  return (
    <div className="min-h-[60svh] grid place-items-center">
      <LoaderIcon className="w-[1.2rem] h-[1.2rem] animate-spin" />
    </div>
  );
}

function NavLink({ children, to }: { children: React.ReactNode; to: string }) {
  const isCurrent = useMatch(to);

  return (
    <Button size="sm" asChild variant={isCurrent ? "default" : "ghost"}>
      <Link to={to}>{children}</Link>
    </Button>
  );
}

export default function FriendshipsPage() {
  const location = useMatch("/friendships");
  const isSubRoute = location?.pathname !== "/friendships";

  const { data: friendshipRequests } = useFriendshipRequests();

  const pendingRequests = friendshipRequests?.filter(
    (req) => req.status === "pending"
  );

  if (!isSubRoute) {
    return <Navigate to="/friendships/all" />;
  }

  return (
    <div className="p-5 flex flex-col h-full gap-5">
      <header className="px-2 flex items-center gap-3">
        <UsersIcon className="w-[1.2rem] h-[1.2rem] text-foreground" />
        <h1 className="font-medium">Friends</h1>

        <Separator orientation="vertical" className="h-5 mx-2" />

        <nav className="flex items-center gap-3">
          <NavLink to="/friendships/all">All</NavLink>
          <NavLink to="/friendships/requests">
            Requests{" "}
            {pendingRequests && pendingRequests.length > 0
              ? " - " + pendingRequests.length
              : ""}
          </NavLink>
          <NavLink to="/friendships/requests-sent">Sent</NavLink>
        </nav>

        <AddFriendDialog>
          <Button size="sm" className="ml-auto gap-1.5">
            <UserPlusIcon className="w-[1rem] h-[1rem]" />
            Add friend
          </Button>
        </AddFriendDialog>
      </header>

      <div className="flex-1">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
