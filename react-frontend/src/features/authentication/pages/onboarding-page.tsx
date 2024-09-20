import CenteredLayout from "@/components/layouts/centered-layout";
import { useAuthLogged } from "../auth-context";
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
import { Input } from "@/components/ui/input";
import { AsyncButton } from "@/components/ui/async-button";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { OnboardingInput, onboardingSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardUser } from "../api";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/logout-button";

export default function OnboardingPage() {
  const navigate = useNavigate();

  const { currentUser, authenticate } = useAuthLogged();

  const form = useForm<OnboardingInput>({
    defaultValues: {
      email: currentUser.email,
    },
    resolver: zodResolver(onboardingSchema),
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: onboardUser,
  });

  async function onSubmit(data: OnboardingInput) {
    await mutateAsync(data);
    await authenticate(localStorage.getItem("token") as string); // Refresh the user
    navigate("/");
  }

  return (
    <CenteredLayout>
      <div className="space-y-8 max-w-[450px] w-full">
        <div className="lg:absolute lg:top-5 lg:right-5 flex items-center justify-between lg:justify-start gap-4">
          <ThemeToggle />
          <LogoutButton />
        </div>
        <header>
          <h1 className="font-medium">Complete your account</h1>
          <p>Finish creating your account.</p>
        </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g.: John Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name you like being called.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 flex-col lg:flex-row">
              <AsyncButton type="submit" isLoading={isPending}>
                Continue
              </AsyncButton>
            </div>
          </form>
        </Form>
      </div>
    </CenteredLayout>
  );
}
