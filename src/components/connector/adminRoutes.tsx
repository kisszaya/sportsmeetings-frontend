import { Profiles } from "components/admin";

import { Navigate } from "react-router-dom";
import { AdminRouteRedirect } from "hoc";

export const adminRoutes = [
  {
    element: (
      <AdminRouteRedirect>
        <Navigate to="/admin/profiles" />
      </AdminRouteRedirect>
    ),
    path: "/admin",
  },
  {
    element: (
      <AdminRouteRedirect>
        <Profiles />
      </AdminRouteRedirect>
    ),
    path: "/admin/profiles",
  },
  {
    element: (
        <AdminRouteRedirect>
          <Profiles />
        </AdminRouteRedirect>
    ),
    path: "/admin/profile",
  },
  {
    element: (
        <AdminRouteRedirect>
          <Profiles />
        </AdminRouteRedirect>
    ),
    path: "/admin/meetings",
  }
];
