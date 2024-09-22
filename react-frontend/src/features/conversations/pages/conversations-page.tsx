import { Navigate, Outlet, useLocation } from "react-router-dom";
import useGetConversations from "../hooks/use-get-conversations";
import Loader from "@/components/loader";

export default function ConversationsPage() {
  const { data: conversations, isSuccess } = useGetConversations();

  const pathname = useLocation().pathname;

  if (pathname === "/conversations") {
    if (isSuccess && conversations.length === 0) {
      return <Navigate to="/friendships" />;
    } else if (isSuccess) {
      return <Navigate to={`/conversations/${conversations[0].id}`} />;
    }

    return <Loader />;
  }

  return <Outlet />;
}
