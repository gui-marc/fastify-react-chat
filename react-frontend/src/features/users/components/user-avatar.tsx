import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import UserStatus from "./user-status";

interface UserAvatarProps extends AvatarProps {
  user: User;
  withStatus?: boolean;
}

export default function UserAvatar({
  user,
  className,
  withStatus = false,
  ...props
}: UserAvatarProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");

  return (
    <Avatar
      className={cn("relative block overflow-visible", className)}
      {...props}
    >
      <AvatarFallback>{initials}</AvatarFallback>
      <AvatarImage src={user.photo?.url} alt={user.name} />
      {withStatus && (
        <UserStatus
          user={user}
          className="absolute bottom-[7.5%] right-[7.5%] w-[15%] h-[15%]"
        />
      )}
    </Avatar>
  );
}
