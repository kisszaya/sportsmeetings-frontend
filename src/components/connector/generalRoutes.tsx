import { Auth, Register } from "components/general";

export const generalRoutes = [
  { element: <Auth />, path: "/auth" },
  { element: <Register />, path: "/register" }
  //{component: NotFound, exact: true, path: '*'}
];
