import { useTranslation } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
      className="shrink-0 px-2 text-sm font-extrabold text-[#146394]"
      aria-label={t("common.switchLanguage")}
    >
      {language === "ar" ? t("common.english") : t("common.arabic")}
    </button>
  );
};

export default LanguageToggle;
