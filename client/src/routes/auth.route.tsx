import { Loader } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { isAuthRoute } from "./comman/route-path";

import { useAuth } from "@/hooks";

export const AuthRoute = () => {
  const location = useLocation();

  const { data, isLoading } = useAuth();

  const user = data?.data?.user;

  const authRoute = isAuthRoute(location.pathname);

  if (isLoading && !authRoute)
    return <Loader className="flex h-8 w-8 animate-spin place-self-center" />;

  return !user ? (
    <Outlet />
  ) : (
    <Navigate to={`workspace/${user.currentWorkspace?._id}`} replace />
  );
};
