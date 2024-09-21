import { client } from "@/api/client";

const BASE_URL = "/users";

export async function searchUsers(search = "", take = 5) {
  if (search === "") return [];

  const response = await client.get<User[]>(`${BASE_URL}`, {
    params: { search, take },
  });
  return response.data;
}

export async function getUserStatus(userId: string) {
  const response = await client.get<UserStatus>(`${BASE_URL}/${userId}/status`);
  return response.data;
}
