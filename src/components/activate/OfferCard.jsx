const Checkbox = ({ checked, disabled }) => (
  <span
    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
      checked
        ? "border-[#146394] bg-[#146394] text-white"
        : "border-gray-300 bg-white"
    } ${disabled ? "opacity-100" : ""}`}
    aria-hidden
  >
    {checked ? (
      <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current">
        <path d="M6.2 11.2 2.8 7.8l1.1-1.1 2.3 2.3 5.9-5.9 1.1 1.1z" />
      </svg>
    ) : null}
  </span>
);

const OfferCard = ({
  company,
  t,
  selectedOptions,
  onToggleOption,
  onChoose,
  planTypeKey = "activate.planType",
  defaultCoverageKey = "activate.civilLiabilityFull",
  feesHeadingClass = "text-[#146394]",
}) => {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold text-[#146394]">
            {t(company.nameKey)}
          </h3>
          <p className="mt-0.5 text-sm font-bold text-[#F5A623]">
            {t(planTypeKey)}
          </p>
          <ul className="mt-3 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-xs font-semibold leading-5 text-[#146394] flex-1">
                {t(company.defaultCoverageKey || defaultCoverageKey)}
              </span>
              <Checkbox checked disabled />
            </li>
            {company.options.map((opt, i) => (
              <li key={`${company.nameKey}-${i}`}>
                <button
                  type="button"
                  onClick={() => onToggleOption(i)}
                  className="flex w-full items-start gap-2 text-start"
                >
                  <span className="text-xs font-semibold leading-5 text-[#146394] flex-1">
                    {t(opt.labelKey)}
                    {opt.price > 0
                      ? ` (${t("activate.addonPrice", { price: opt.price })})`
                      : ""}
                  </span>
                  <Checkbox checked={Boolean(selectedOptions[i])} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-[88px] shrink-0 flex-col items-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-gray-200 bg-white p-1.5">
            <img
              src={company.logo}
              alt={t(company.nameKey)}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <p className="mt-3 text-2xl font-extrabold leading-none text-[#146394]">
            {company.price}
          </p>
          <p className="mt-1 text-center text-[11px] font-semibold text-gray-400">
            {t("activate.priceUnit")}
          </p>
        </div>
      </div>

      {company.fees?.length ? (
        <div className="mt-4 border-t border-gray-200 pt-3">
          <p className={`mb-2 text-sm font-extrabold ${feesHeadingClass}`}>
            {t("activate.additionalFees")}
          </p>
          <ul className="space-y-1.5">
            {company.fees.map((item) => (
              <li
                key={item.labelKey}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-gray-500">
                  {t(item.labelKey)}
                </span>
                <span className="shrink-0 font-bold text-[#146394]">
                  {item.amount} {t("common.currencyRiyal")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onChoose}
        className="mt-4 w-full rounded-xl bg-[#146394] py-3 text-base font-bold text-white"
      >
        {t("activate.chooseOffer")}
      </button>
    </article>
  );
};

export default OfferCard;
