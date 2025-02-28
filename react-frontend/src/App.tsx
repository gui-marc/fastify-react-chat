import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/authentication/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { lazy, Suspense } from "react";
import Loader from "./components/loader";
import ProtectedRoute from "./features/authentication/components/protected-route";
import DashboardLayout from "./components/layouts/dashboard-layout";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import SocketProvider from "./context/socket-context";

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

const FriendshipsPage = lazy(
  () => import("@/features/friendship/pages/friendships-page")
);

const AllFriendshipsPage = lazy(
  () => import("@/features/friendship/pages/all-friendships-page")
);

const FriendshipRequestsSentPage = lazy(
  () => import("@/features/friendship/pages/friendship-requests-sent-page")
);

const FriendshipRequestsReceivedPage = lazy(
  () => import("@/features/friendship/pages/friendship-requests-received-page")
);

const ConversationsPage = lazy(
  () => import("@/features/conversations/pages/conversations-page")
);

const ConversationPage = lazy(
  () => import("@/features/conversations/pages/conversation-page")
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <AuthProvider>
            <SocketProvider>
              <TooltipProvider>
                <Toaster />
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="*" Component={NotFoundPage} />
                    <Route path="sign-in" Component={SignInPage} />
                    <Route
                      path="input-passcode"
                      Component={InputPasscodePage}
                    />

                    <Route Component={ProtectedRoute}>
                      <Route path="onboarding" Component={OnboardingPage} />
                      <Route path="/" Component={DashboardLayout}>
                        <Route path="friendships" Component={FriendshipsPage}>
                          <Route path="all" Component={AllFriendshipsPage} />
                          <Route
                            path="requests-sent"
                            Component={FriendshipRequestsSentPage}
                          />
                          <Route
                            path="requests"
                            Component={FriendshipRequestsReceivedPage}
                          />
                        </Route>
                        <Route
                          path="conversations"
                          Component={ConversationsPage}
                        >
                          <Route
                            path=":conversationId"
                            Component={ConversationPage}
                          />
                        </Route>
                      </Route>
                    </Route>
                  </Routes>
                </Suspense>
              </TooltipProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
