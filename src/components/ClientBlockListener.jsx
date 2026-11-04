import { useEffect, useState } from "react";
import axios from "axios";
import { api_route, socket } from "../App";
import { getCurrentUserId } from "../utils/orderId";
import { useTranslation } from "../context/LanguageContext";

export default function ClientBlockListener() {
  const { t, dir } = useTranslation();
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const id = getCurrentUserId();
      if (!id) return;
      try {
        const { data } = await axios.get(`${api_route}/order/status/${id}`);
        setIsBlocked(Boolean(data.blocked));
      } catch {
        // ignore
      }
    };

    checkStatus();

    const onClientBlocked = ({ id, blocked }) => {
      const currentId = getCurrentUserId();
      if (!currentId || id !== currentId) return;
      setIsBlocked(Boolean(blocked));
    };

    socket.on("clientBlocked", onClientBlocked);
    return () => socket.off("clientBlocked", onClientBlocked);
  }, []);

  if (!isBlocked) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center bg-white px-6"
      dir={dir}
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
        aria-hidden="true"
      >
        <path
          d="M36 6L66 62H6L36 6Z"
          fill="#E53935"
          stroke="#E53935"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="33" y="26" width="6" height="22" rx="2" fill="white" />
        <circle cx="36" cy="54" r="3.5" fill="white" />
      </svg>
      <p className="text-center text-lg text-gray-500">
        {t("block.siteUnavailable")}
      </p>
    </div>
  );
}
