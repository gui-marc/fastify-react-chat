import Loader from "@/components/loader";
import { useAuth } from "../auth-context";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, isPending, currentUser } = useAuth();

  if (isPending) {
    return <Loader />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/sign-in" />;
  }

  if (
    !currentUser.onboardingCompleted &&
    window.location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" />;
  }

  return <Outlet />;
}
