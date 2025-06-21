import { Loader } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks";

export const ProtectedRoute = () => {
  const { data, isLoading } = useAuth();

  const user = data?.data?.user;

  if (isLoading)
    return <Loader className="flex h-8 w-8 animate-spin place-self-center" />;

  return user ? <Outlet /> : <Navigate to="/" replace />;
};
