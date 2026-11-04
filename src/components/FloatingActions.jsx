import { useEffect, useState } from "react";
import { LuHeadphones, LuChevronUp } from "react-icons/lu";
import { useTranslation } from "../context/LanguageContext";
import { scrollToTop } from "../utils/scroll";

const FloatingActions = ({ className = "fixed bottom-5 left-4 z-40" }) => {
  const { t } = useTranslation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${className} flex flex-col items-center gap-2`}>
      <a
        href="tel:8001180044"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5A623] text-white shadow-lg"
        aria-label={t("apply.contactSupport")}
      >
        <LuHeadphones className="h-6 w-6" />
      </a>
      {showTop ? (
        <button
          type="button"
          onClick={scrollToTop}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#146394] text-white shadow-lg"
          aria-label={t("apply.scrollToTop")}
        >
          <LuChevronUp className="h-6 w-6" />
        </button>
      ) : null}
    </div>
  );
};

export default FloatingActions;
