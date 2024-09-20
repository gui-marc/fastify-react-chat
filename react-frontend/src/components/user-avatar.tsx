import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps extends AvatarProps {
  user: User;
}

export default function UserAvatar({ user, ...props }: UserAvatarProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");

  return (
    <Avatar {...props}>
      <AvatarFallback>{initials}</AvatarFallback>
      <AvatarImage src={user.photo?.url} alt={user.name} />
    </Avatar>
  );
}
