import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/authentication/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { lazy, Suspense } from "react";
import Loader from "./components/loader";
import ProtectedRoute from "./features/authentication/components/protected-route";
import { TooltipProvider } from "./components/ui/tooltip";

const SignInPage = lazy(
  () => import("@/features/authentication/pages/sign-in-page")
);

const InputPasscodePage = lazy(
  () => import("@/features/authentication/pages/input-passcode-page")
);

const NotFoundPage = lazy(() => import("@/pages/not-found-page"));
const OnboardingPage = lazy(
  () => import("@/features/authentication/pages/onboarding-page")
);

const TestingAuthPage = lazy(() => import("@/pages/testing-auth"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="*" Component={NotFoundPage} />
                  <Route path="sign-in" Component={SignInPage} />
                  <Route path="input-passcode" Component={InputPasscodePage} />

                  <Route Component={ProtectedRoute}>
                    <Route path="test-auth" Component={TestingAuthPage} />
                    <Route path="onboarding" Component={OnboardingPage} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
