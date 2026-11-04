import { Navigate, useLocation } from "react-router-dom";

/** Preserves query string when redirecting legacy /motsl and /motslOtp to /phone */
export default function RedirectMotslToPhone() {
  const { search } = useLocation();
  return <Navigate to={`/phone${search}`} replace />;
}
