import { AsyncButton } from "@/components/ui/async-button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/responsive-dialog";
import useAddFriend from "../hooks/use-add-friend";
import { Input } from "@/components/ui/input";
import { SearchIcon, UserPlusIcon } from "lucide-react";
import useSearchUsers from "@/features/users/hooks/use-search-users";
import UserAvatar from "@/features/users/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AddFriendDialogProps {
  children: React.ReactNode;
}

function Loading() {
  return (
    <ul className="grid gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-10 rounded-lg" />
      ))}
    </ul>
  );
}

export function UserItem({ user }: { user: User }) {
  const { isPending, mutate } = useAddFriend();

  function handleClick() {
    mutate({ friendId: user.id });
  }

  return (
    <li className="flex items-center gap-3 text-sm">
      <UserAvatar user={user} />
      <div className="text-start">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      <AsyncButton
        onClick={handleClick}
        size="icon"
        variant="ghost"
        isLoading={isPending}
        className="ml-auto"
      >
        <UserPlusIcon className="w-[1.2rem] h-[1.2rem]" />
        <span className="sr-only">Add user {user.name} as friend</span>
      </AsyncButton>
    </li>
  );
}

export default function AddFriendDialog({ children }: AddFriendDialogProps) {
  const {
    query: { data: users, isPending },
    setSearch,
    search,
  } = useSearchUsers();

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="px-6 pb-6">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Add friend</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Send a friendship request to a user.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex flex-col-reverse gap-5 sm:flex-col">
          <div className="relative">
            <Input
              placeholder="Search for a user name or email..."
              className="pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute top-2.5 right-2.5 pointer-events-none">
              <SearchIcon className="w-[1.125rem] h-[1.125rem]" />
              <span className="sr-only">Search</span>
            </div>
          </div>

          <div className={cn("lg:min-h-[150px]")}>
            {users && users.length > 0 && (
              <ol className="grid gap-3">
                {users.map((user) => (
                  <UserItem key={user.id} user={user} />
                ))}
              </ol>
            )}

            {isPending && <Loading />}
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
