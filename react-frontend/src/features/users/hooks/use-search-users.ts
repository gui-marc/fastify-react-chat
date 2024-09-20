import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "react-use";
import { searchUsers } from "../api";

export default function useSearchUsers(take = 5) {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");

  useDebounce(
    () => {
      setDebouncedSearch(search.trim());
    },
    300,
    [search]
  );

  const query = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: () => searchUsers(debouncedSearch, take),
  });

  return {
    setSearch,
    search,
    debouncedSearch,
    query,
  };
}
