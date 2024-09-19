import CenteredLayout from "@/components/layouts/centered-layout";
import { Button } from "@/components/ui/button";
import { useAuthLogged } from "@/features/authentication/auth-context";

export default function TestingAuth() {
  const { currentUser, logout } = useAuthLogged();

  return (
    <CenteredLayout>
      <div className="space-y-8">
        <h1>Hello {currentUser.name}</h1>
        <Button onClick={logout}>logout</Button>
      </div>
    </CenteredLayout>
  );
}
