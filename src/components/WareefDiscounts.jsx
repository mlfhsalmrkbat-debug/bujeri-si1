import { useState } from "react";
import { useTranslation } from "../context/LanguageContext";

const DISCOUNTS = [
  { img: "RoshRayhaan.jpg", nameKey: "apply.wareefRoshRayhaan", percent: "15" },
  { img: "none.svg", nameKey: "apply.wareefNoon", percent: "15" },
  { img: "perfectWight.png", nameKey: "apply.wareefPerfectWeight", percent: "50" },
  { img: "drive7.png", nameKey: "apply.wareefDrive7", percent: "20" },
  { img: "swater.jpg", nameKey: "apply.wareefSweater", percent: "20" },
  { img: "sivvi.svg", nameKey: "apply.wareefSivvi", percent: "10" },
  { img: "Physiotherabia.jpg", nameKey: "apply.wareefPhysiotherabia", percent: "20" },
  { img: "Group-6444.svg", nameKey: "apply.wareefNovimed", percent: "15" },
];

const WareefDiscounts = () => {
  const { t, dir } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-4 w-full px-4 py-6" dir={dir}>
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        {expanded ? (
          <>
            <h2 className="mb-3 text-center text-xl font-bold text-[#146394] sm:text-2xl">
              {t("apply.wareefTitle")}
            </h2>
            <p className="max-w-2xl text-center text-sm text-[#146394]">
              {t("apply.wareefSubtitle")}
            </p>
            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 justify-center gap-x-4 gap-y-5">
              {DISCOUNTS.map(({ img, nameKey, percent }) => (
                <div
                  key={nameKey}
                  className="flex flex-row items-center gap-3 rounded-xl bg-white px-3 py-3 shadow-sm"
                >
                  <img
                    loading="lazy"
                    className="h-12 w-12 shrink-0 object-contain"
                    src={`/wareef/${img}`}
                    alt={t(nameKey)}
                  />
                  <div className="flex min-w-0 flex-col text-start">
                    <span className="text-xs font-bold leading-4 text-[#146394]">
                      {t(nameKey)}
                    </span>
                    <span className="text-sm font-extrabold leading-4 text-[#146394]">
                      {t("apply.discountOff", { percent })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="mt-4 bg-transparent text-sm font-bold text-[#146394] underline underline-offset-4"
        >
          {expanded ? t("common.close") : t("apply.wareefMore")}
        </button>
      </div>
    </section>
  );
};

export default WareefDiscounts;
