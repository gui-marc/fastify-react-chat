import CenteredLayout from "@/components/layouts/centered-layout";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { PasscodeInput, passcodeSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AsyncButton } from "@/components/ui/async-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMutation } from "@tanstack/react-query";
import { verifyPasscode } from "../api";
import { useAuth } from "../auth-context";

export default function InputPasscodePage() {
  const navigate = useNavigate();

  const { authenticate } = useAuth();

  const form = useForm<PasscodeInput>({
    resolver: zodResolver(passcodeSchema),
  });

  const {
    state: { email },
  } = useLocation();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["verify-passcode"],
    mutationFn: verifyPasscode,
  });

  if (!email) {
    return <Navigate to="/sign-in" />;
  }

  async function onSubmit(data: PasscodeInput) {
    const { token } = await mutateAsync({ ...data, email });
    const user = await authenticate(token);
    if (user.onboardingCompleted) {
      navigate("/");
    } else {
      navigate("/onboarding");
    }
  }

  return (
    <CenteredLayout>
      <div className="space-y-8 max-w-[450px] w-full">
        <div className="lg:absolute lg:top-5 lg:right-5">
          <ThemeToggle />
        </div>
        <header className="space-y-1">
          <h1 className="font-medium">Enter passcode</h1>
          <p>
            The passcode was sent to{" "}
            <b className="font-medium text-foreground">{email}</b>.
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="passcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Passcode</FormLabel>
                    <FormControl>
                      <InputOTP disabled={isPending} maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Didn't get it?{" "}
                      <Link
                        to="/sign-in"
                        className="underline-offset-2 hover:underline text-primary"
                      >
                        Resend it.
                      </Link>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AsyncButton isLoading={isPending} type="submit">
              Continue
            </AsyncButton>
          </form>
        </Form>
      </div>
    </CenteredLayout>
  );
}
