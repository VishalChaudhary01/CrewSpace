import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  authenticationRoutePaths,
  baseRoutePaths,
  protectedRoutePaths,
} from "./comman/routes";
import { AuthRoute } from "./auth.route";
import { ProtectedRoute } from "./protected.route";
import { BaseLayout } from "@/layouts/base.layout";
import { AppLayout } from "@/layouts/app.layout";
import { NotFoundPage } from "@/pages/error/not-found.page";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          {baseRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route path='/' element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>
        <Route path='/' element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {protectedRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
