import { useQuery } from "@tanstack/react-query";
import { getUserStatus } from "../api";

export default function useGetUserStatus({ user }: { user: User }): UserStatus {
  const { data } = useQuery({
    queryKey: ["user-status", user.id],
    queryFn: () => getUserStatus(user.id),
    retryOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  return (data as UserStatus) ?? "offline";
}
