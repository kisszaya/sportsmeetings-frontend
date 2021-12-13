import { ReactChild } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { RootState } from "store";

type UserRouteRedirectType = {
  children: ReactChild | ReactChild[];
};
export const UserRouteRedirect = (props: UserRouteRedirectType) => {
  const { data: myInfo } = useSelector(
    (state: RootState) => state.profile.myInfo
  );
  const location = useLocation();

  if (localStorage.getItem("x-auth-token") === null) {
    return <Navigate to="/auth" state={{ from: location }} />;
  }
  if (myInfo?.roles.includes("ROLE_ADMIN")) {
    return (
      <Navigate
        to={`/admin${window.location.pathname}`}
        state={{ from: location }}
      />
    );
  }
  return <>{props.children}</>;
};
