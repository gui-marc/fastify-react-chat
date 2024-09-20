import { Input } from "@/components/ui/input";
import useGetAllFriends from "../hooks/use-get-all-friends";
import UserAvatar from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";

function FriendshipItem({ friend }: { friend: User }) {
  return (
    <li>
      <div>
        <UserAvatar user={friend} />
        <span>{friend.name}</span>
      </div>
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

export default function AllFriendshipsPage() {
  const { data: friends } = useGetAllFriends();

  return (
    <div>
      <Input placeholder="Search for a friend..." className="w-full mb-5" />

      {!friends && <Loading />}

      {friends && friends.length === 0 && <p>No friends yet.</p>}

      {friends && friends.length > 0 && (
        <ol className="grid gap-3">
          {friends.map((friend) => (
            <FriendshipItem key={friend.id} friend={friend} />
          ))}
        </ol>
      )}
    </div>
  );
}
