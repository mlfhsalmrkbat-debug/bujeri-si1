import { useTranslation } from "../context/LanguageContext";
import "./SponsorsSlider.css";

const PARTNERS = [
  { name: "MEDGULF", kind: "text", weight: "extrabold" },
  { name: "GIG", kind: "text", weight: "extrabold" },
  { name: "amana", kind: "text", weight: "extrabold" },
];

const SponsorsSlider = () => {
  const { t } = useTranslation();

  return (
    <section className="sponsors-slider my-8!">
      <div className="sponsors-bar" dir="ltr">
        <div className="sponsors-ia">
          <span className="sponsors-ia-label text-center w-full">{t("apply.licensedBy")}</span>
          <img
            src="/sponsors/InsuranceCompanylogos/Group-6528.svg"
            alt="Insurance Authority"
            className="sponsors-ia-logo"
          />
        </div>

        <span className="sponsors-divider" aria-hidden />

        <div className="sponsors-partners">
          {PARTNERS.map((partner) =>
            partner.kind === "image" ? (
              <img
                key={partner.name}
                src={partner.src}
                alt={partner.name}
                className="sponsors-partner-img"
              />
            ) : (
              <span
                key={partner.name}
                className={`sponsors-partner-text sponsors-partner-${partner.weight} text-lg!`}
              >
                {partner.name}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSlider;
