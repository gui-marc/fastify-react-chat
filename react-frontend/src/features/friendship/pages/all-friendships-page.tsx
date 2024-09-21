import { Input } from "@/components/ui/input";
import useGetAllFriends from "../hooks/use-get-all-friends";
import UserAvatar from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { HeartCrackIcon, UserPlusIcon } from "lucide-react";
import AddFriendDialog from "../components/add-friend-dialog";
import { useState } from "react";
import FadeIn from "@/components/transitions/fade-in";

function FriendshipItem({ friend }: { friend: User }) {
  return (
    <li className="flex items-center gap-4">
      <UserAvatar user={friend} />
      <h3>{friend.name}</h3>
      <p>{friend.email}</p>
    </li>
  );
}

function Loading() {
  return (
    <ul className="grid gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-10 rounded-lg" />
      ))}
    </ul>
  );
}

function Empty({ search }: { search?: string }) {
  const isEmptySearch = search?.trim() === "";

  return (
    <EmptyState className="min-h-[60svh]">
      <EmptyStateIcon Icon={HeartCrackIcon} />
      {isEmptySearch ? (
        <EmptyStateTitle>No friends found</EmptyStateTitle>
      ) : (
        <EmptyStateTitle>No results found for "{search}"</EmptyStateTitle>
      )}
      {isEmptySearch ? (
        <EmptyStateDescription>
          You don't have any friends yet. Search for users to add them as
          friends.
        </EmptyStateDescription>
      ) : (
        <EmptyStateDescription>
          We couldn't find any friends matching your search. Try another query.
        </EmptyStateDescription>
      )}
      <AddFriendDialog>
        <Button variant="outline" className="gap-2 mt-5">
          <UserPlusIcon className="w-[1.2rem] h-[1.2rem]" />
          Add friend
        </Button>
      </AddFriendDialog>
    </EmptyState>
  );
}

export default function AllFriendshipsPage() {
  const [search, setSearch] = useState("");
  const { data: friends } = useGetAllFriends();

  const filteredFriends = friends?.filter(
    (friend) =>
      friend.name.toLowerCase().includes(search.toLowerCase()) ||
      friend.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a friend..."
        className="w-full mb-5"
      />

      <FadeIn>
        {!filteredFriends && <Loading />}

        {filteredFriends && filteredFriends.length === 0 && (
          <Empty search={search} />
        )}

        {filteredFriends && filteredFriends.length > 0 && (
          <ol className="grid gap-3">
            {filteredFriends.map((friend) => (
              <FriendshipItem key={friend.id} friend={friend} />
            ))}
          </ol>
        )}
      </FadeIn>
    </div>
  );
}
