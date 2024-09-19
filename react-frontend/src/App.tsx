import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/authentication/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { lazy, Suspense } from "react";
import Loader from "./components/loader";
import ProtectedRoute from "./features/authentication/components/protected-route";
import TestingAuth from "./pages/testing-auth";

const SignInPage = lazy(
  () => import("@/features/authentication/pages/sign-in-page")
);

const InputPasscodePage = lazy(
  () => import("@/features/authentication/pages/input-passcode-page")
);

const NotFoundPage = lazy(() => import("@/pages/not-found-page"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="*" Component={NotFoundPage} />
                <Route path="sign-in" Component={SignInPage} />
                <Route path="input-passcode" Component={InputPasscodePage} />

                <Route Component={ProtectedRoute}>
                  <Route path="test-auth" Component={TestingAuth} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
