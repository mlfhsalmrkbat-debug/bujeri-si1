import { useTranslation } from "../context/LanguageContext";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiMapPinAreaBold } from "react-icons/pi";
import { SiSpeedtest } from "react-icons/si";
import { FaWallet } from "react-icons/fa";
import { FaFire } from "react-icons/fa";
import { PiStackBold } from "react-icons/pi";

const HEADER_ITEMS = [
  { icon: <IoDocumentTextOutline className="why-choose-icon text-4xl! text-[#146394]" />, titleKey: "apply.chooseOffers" },
  { icon: <PiMapPinAreaBold className="why-choose-icon text-4xl! text-[#146394]" />, titleKey: "apply.chooseLocal" },
];

const GRID_ITEMS = [
  { icon: <SiSpeedtest className="why-choose-icon text-4xl! text-[#146394]" />, titleKey: "apply.chooseFast" },
  { icon: <FaWallet className="why-choose-icon text-4xl! text-[#146394]" />, titleKey: "apply.choosePrice" },
  { icon: <FaFire className="why-choose-icon text-4xl! text-[#146394]" />, titleKey: "apply.chooseSupport" },
  { icon: <PiStackBold className="why-choose-icon text-4xl! text-[#146394]" />, titleKey: "apply.chooseInstall" },
];

const WhyChooseBcare = () => {
  const { t, dir } = useTranslation();

  return (
    <section className="w-full bg-white px-4 py-8" dir={dir}>
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center text-2xl font-extrabold text-[#146394] sm:text-2xl">
          {t("apply.whyChooseTitle")}
        </h2>

        <div className="my-10 grid grid-cols-2 gap-6">
          {HEADER_ITEMS.map(({ icon, titleKey }) => (
            <div key={titleKey} className="flex flex-col items-center">
              {icon}
              <h3 className="mt-3 text-center text-sm font-extrabold text-[#146394] sm:text-base">
                {t(titleKey)}
              </h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          {GRID_ITEMS.map(({ icon, titleKey }) => (
            <div key={titleKey} className="flex flex-col items-center">
              {icon}
              <h3 className="mt-3 text-center text-sm font-extrabold text-[#146394] sm:text-base">
                {t(titleKey)}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseBcare;
