import CenteredLayout from "@/components/layouts/centered-layout";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SignInInput, signInSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { AsyncButton } from "@/components/ui/async-button";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { sendPasscode } from "../api";

export default function SignInPage() {
  const navigate = useNavigate();

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["send-passcode"],
    mutationFn: sendPasscode,
  });

  async function handleSubmit(data: SignInInput) {
    await mutateAsync(data);
    navigate("/input-passcode", { state: { email: data.email } });
  }

  return (
    <CenteredLayout>
      <div className="space-y-8 max-w-[450px]">
        <div className="lg:absolute lg:top-5 lg:right-5">
          <ThemeToggle />
        </div>
        <header>
          <h1 className="font-medium">Sign in</h1>
          <p>Enter your email to receive a one-time passcode.</p>
        </header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The passcode will be sent to this email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 flex-col lg:flex-row">
              <AsyncButton type="submit" isLoading={isPending}>
                Send passcode
              </AsyncButton>
            </div>
          </form>
        </Form>
      </div>
    </CenteredLayout>
  );
}
