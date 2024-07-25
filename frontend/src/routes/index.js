import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import MainLayout from "../layouts/main";
import AuthLayout from "../layouts/auth";

import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/user",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "new-password", element: <NewPasswordPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
      ],
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "detection", element: <Detection /> },
        { path: "check", element: <Check /> },
        { path: "verified", element: <Verified /> },
        { path: "resource-center", element: <ResourceCenter /> },
        { path: "recommendation", element: <Recommendation /> },

        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const LoginPage = Loadable(lazy(() => import("../pages/auth/LoginPage")))
const NewPasswordPage = Loadable(lazy(() => import("../pages/auth/NewPasswordPage")))
const ResetPasswordPage = Loadable(lazy(() => import("../pages/auth/ResetPasswordPage")))

const Home = Loadable(lazy(() => import("../pages/main/Home/Home")));
const Detection = Loadable(lazy(() => import("../pages/main/Detection/Detection")))
const Check = Loadable(lazy(() => import("../pages/main/Check/Check")))
const Verified = Loadable(lazy(() => import("../pages/main/Verified/Verified")))
const ResourceCenter = Loadable(lazy(() => import("../pages/main/ResourceCenter/ResourceCenter")))
const Recommendation = Loadable(lazy(() => import("../pages/main/Recommendation/Recommendation")))
const Page404 = Loadable(lazy(() => import("../pages/Page404/Page404")))
