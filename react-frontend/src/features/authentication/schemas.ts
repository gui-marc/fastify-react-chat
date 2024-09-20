import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const passcodeSchema = z.object({
  passcode: z.string().length(6).regex(/^\d+$/),
});

export type PasscodeInput = z.infer<typeof passcodeSchema>;

export const onboardingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
