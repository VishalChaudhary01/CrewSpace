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
    return <Loader className='w-8 h-8 animate-spin place-self-center flex' />;

  return !user ? (
    <Outlet />
  ) : (
    <Navigate to={`workspace/${user.currentWorkspace?._id}`} replace />
  );
};
