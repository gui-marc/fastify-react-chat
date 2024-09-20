import { client } from "@/api/client";
import { OnboardingInput, PasscodeInput, SignInInput } from "./schemas";

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

export async function onboardUser(data: OnboardingInput) {
  const response = await client.post<User>(`${BASE_URL}/onboarding`, data);
  return response.data;
}

export async function logout() {
  await client.post(`${BASE_URL}/logout`);
}
