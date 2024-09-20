import { client } from "@/api/client";

const BASE_URL = "/users";

export async function searchUsers(search = "", take = 5) {
  if (search === "") return [];

  const response = await client.get<User[]>(`${BASE_URL}`, {
    params: { search, take },
  });
  return response.data;
}
