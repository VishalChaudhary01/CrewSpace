import { Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const location = useLocation();
  console.log("Protected route: ", location.pathname);

  return <Outlet />;
};
