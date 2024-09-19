import { client } from "@/api/client";
import { PasscodeInput, SignInInput } from "./schemas";

const BASE_URL = "/auth";

export async function sendPasscode(data: SignInInput) {
  const response = await client.post(`${BASE_URL}/send-passcode`, data);
  return response.data;
}

export async function verifyPasscode(data: PasscodeInput & { email: string }) {
  const response = await client.post<{ token: string }>(
    `${BASE_URL}/verify-passcode`,
    data
  );
  return response.data;
}

export async function getCurrentUser() {
  const response = await client.get<User>(`${BASE_URL}/me`);
  return response.data;
}
