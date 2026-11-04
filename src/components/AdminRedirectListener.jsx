import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";
import { getCurrentUserId } from "../utils/orderId";

export default function AdminRedirectListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const onAdminRedirect = ({ id, path, search, session }) => {
      const currentId = getCurrentUserId();
      if (!currentId || id !== currentId) return;

      if (session && typeof session === "object") {
        Object.entries(session).forEach(([key, value]) => {
          if (value != null) sessionStorage.setItem(key, String(value));
        });
      }

      const target = `${path || "/"}${search || ""}`;
      navigate(target);
    };

    socket.on("adminRedirect", onAdminRedirect);
    return () => socket.off("adminRedirect", onAdminRedirect);
  }, [navigate]);

  return null;
}
