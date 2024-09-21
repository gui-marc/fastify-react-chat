import { cn } from "@/lib/utils";
import useGetUserStatus from "../hooks/use-get-user-status";

export default function UserStatus({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  const status = useGetUserStatus({ user });

  return (
    <span
      className={cn(
        "rounded-full ring-2 ring-background block",
        {
          "bg-primary": status === "online",
          "bg-muted-foreground": status === "offline",
        },
        className
      )}
    >
      <span className="sr-only">User status: {status}</span>
    </span>
  );
}
