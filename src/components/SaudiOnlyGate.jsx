import { useEffect, useState } from "react";
import axios from "axios";
import { api_route } from "../App";
import { useTranslation } from "../context/LanguageContext";

const GEO_CACHE_KEY = "saudiOnlyGeo";

// Set to true to allow Saudi Arabia visitors only.
export const SAUDI_ONLY_ENABLED = false;

export default function SaudiOnlyGate() {
  const { t, dir } = useTranslation();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!SAUDI_ONLY_ENABLED) return undefined;

    let cancelled = false;

    const apply = (allowed) => {
      if (!cancelled) setBlocked(allowed === false);
    };

    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      apply(true);
      return () => {
        cancelled = true;
      };
    }

    try {
      const cached = sessionStorage.getItem(GEO_CACHE_KEY);
      if (cached === "SA" || cached === "LOCAL") {
        apply(true);
        return () => {
          cancelled = true;
        };
      }
      if (cached && cached !== "SA" && cached !== "LOCAL" && cached !== "") {
        apply(false);
      }
    } catch {
      /* ignore */
    }

    const check = async () => {
      try {
        const { data } = await axios.get(`${api_route}/geo`);
        const country = String(data?.country || "");
        try {
          sessionStorage.setItem(GEO_CACHE_KEY, country);
        } catch {
          /* ignore */
        }
        apply(data?.allowed !== false);
      } catch {
        apply(true);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!SAUDI_ONLY_ENABLED || !blocked) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center bg-white px-6"
      dir={dir}
    >
      <img src="/logo.svg" alt="" className="mb-6 h-14 w-14" />
      <p className="text-center text-lg font-bold text-[#146394]">
        {t("block.regionBlocked")}
      </p>
    </div>
  );
}
