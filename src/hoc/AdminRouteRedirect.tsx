import { ReactChild } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { RootState } from "store";

type AdminRouteRedirectType = {
  children: ReactChild | ReactChild[];
};
export const AdminRouteRedirect = (props: AdminRouteRedirectType) => {
  const { data: myInfo } = useSelector((state: RootState) => state.profile.myInfo);
  const location = useLocation();

  if (myInfo === null) {
    return <Navigate to="/auth" state={{ from: location }} />;
  }
  if (myInfo.roles.includes("ROLE_USER")) {
    return (
      <Navigate
        to={window.location.pathname.replace("/admin", "")}
        state={{ from: location }}
      />
    );
  }
  return <>{props.children}</>;
};
