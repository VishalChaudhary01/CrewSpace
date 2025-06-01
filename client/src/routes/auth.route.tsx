import { Outlet, useLocation } from "react-router-dom";

export const AuthRoute = () => {
  const location = useLocation();
  console.log("Auth route: ", location.pathname);

  return <Outlet />;
};
