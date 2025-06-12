import { Loader } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/auth.context";
import { isAuthRoute } from "./comman/route-path";

export const AuthRoute = () => {
  const location = useLocation();

  const { user, isAuthLoading } = useAuthContext();

  const authRoute = isAuthRoute(location.pathname);

  if (isAuthLoading && !authRoute)
    return <Loader className='w-8 h-8 animate-spin place-self-center flex' />;

  return !user ? (
    <Outlet />
  ) : (
    <Navigate to={`workspace/${user.currentWorkspace?._id}`} replace />
  );
};
