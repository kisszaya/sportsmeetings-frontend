import { lazy } from "react";

export const Auth = lazy(() => import("./auth/Auth"));
export const Register = lazy(() => import("./register/Register"));

// Loading
export { Loading } from "./loading/Loading";
