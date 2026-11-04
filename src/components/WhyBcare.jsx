import { useTranslation } from "../context/LanguageContext";
import "./WhyBcare.css";
import { LuBadgeDollarSign } from "react-icons/lu";
import { MdOutlineChecklist } from "react-icons/md";
import { GoStopwatch } from "react-icons/go";
import { TiLocationOutline } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";

const WHY_ITEMS = [
  {
    icon: "sechleInsure",
    titleKey: "apply.whySchedule",
    descKey: "apply.whyScheduleDesc",
  },
  {
    icon: (
      <LuBadgeDollarSign className="why-bcare-icon text-2xl! text-[#146394]" />
    ),
    titleKey: "apply.whyPrices",
    descKey: "apply.whyPricesDesc",
    type: "icon",
  },
  {
    icon: (
      <MdOutlineChecklist className="why-bcare-icon text-2xl! text-[#146394]" />
    ),
    titleKey: "apply.whyCustomize",
    descKey: "apply.whyCustomizeDesc",
    type: "icon",
  },
  {
    icon: <GoStopwatch className="why-bcare-icon text-2xl! text-[#146394]" />,
    titleKey: "apply.whyInsureMin",
    descKey: "apply.whyInsureMinDesc",
    type: "icon",
  },
  {
    icon: (
      <TiLocationOutline className="why-bcare-icon text-2xl! text-[#146394]" />
    ),
    titleKey: "apply.whyOnePlace",
    descKey: "apply.whyOnePlaceDesc",
    type: "icon",
  },
  {
    icon: "benfit",
    titleKey: "apply.whyBenefits",
    descKey: "apply.whyBenefitsDesc",
  },
  {
    icon: "discounts",
    titleKey: "apply.whyDiscounts",
    descKey: "apply.whyDiscountsDesc",
  },
  {
    icon: <FaEdit className="why-bcare-icon text-2xl! text-[#146394]" />,
    titleKey: "apply.whyFast",
    descKey: "apply.whyFastDesc",
    type: "icon",
  },
];

const WhyBcare = () => {
  const { t, dir } = useTranslation();

  return (
    <section className="why-bcare" dir={dir}>
      <h2 className="why-bcare-title">{t("apply.whyBcareTitle")}</h2>
      <div className="why-bcare-grid">
        {WHY_ITEMS.map(({ icon, titleKey, descKey, type }) => (
          <div key={titleKey} className="why-bcare-card">
            {type === "icon" ? (
              icon
            ) : (
              <img
                loading="lazy"
                className="why-bcare-icon"
                src={`/why-bcare/${icon}.svg`}
                alt={t(titleKey)}
              />
            )}
            <h3>{t(titleKey)}</h3>
            <p>{t(descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyBcare;
