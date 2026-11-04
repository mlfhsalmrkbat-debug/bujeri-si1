import { useEffect } from "react";
import { LuX } from "react-icons/lu";

const dash = "—";

function parseDate(value) {
  if (!value) return null;
  const s = String(value).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  m = s.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatShort(date) {
  if (!date) return dash;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

function formatLong(date, language) {
  if (!date) return dash;
  try {
    return date.toLocaleDateString(
      language === "en" ? "en-GB" : "ar-EG-u-nu-latn",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  } catch {
    return formatShort(date);
  }
}

function addYears(date, years) {
  if (!date) return null;
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

function makePolicyNumber(parsed) {
  const raw = String(parsed.national_id || parsed._id || "XXXXXX");
  const slug = raw
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-6)
    .toUpperCase()
    .padStart(6, "X");
  const year = new Date().getFullYear();
  return `POL-${slug}-${year}`;
}

const SectionHead = ({ n, title }) => (
  <div className="mb-3 mt-6 flex items-center gap-2 border-b-2 border-[#F5A623] pb-1.5">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5A623] text-xs font-extrabold text-white">
      {n}
    </span>
    <h3 className="text-sm font-extrabold text-[#146394]">{title}</h3>
  </div>
);

const DocRow = ({ label, value, valueClass = "font-extrabold text-[#146394]" }) => (
  <div className="flex items-start justify-between gap-3 border-b border-gray-100 py-2.5 last:border-b-0">
    <dt className="text-xs font-semibold text-gray-400">{label}</dt>
    <dd className={`text-end text-sm ${valueClass}`}>{value || dash}</dd>
  </div>
);

const PolicyPreviewModal = ({
  t,
  dir,
  language,
  parsed,
  company,
  companyName,
  isComprehensive,
  insuranceType,
  price,
  vat,
  total,
  onClose,
}) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const start = parseDate(parsed.startedDate);
  const end = addYears(start, 1);
  const policyNo = makePolicyNumber(parsed);
  const money = (n) => `${Number(n).toFixed(2)} ${t("common.currencySar")}`;

  const coverage = [
    t(
      company.defaultCoverageKey ||
        (isComprehensive
          ? "activateShamel.fullCoverage"
          : "activate.civilLiabilityFull")
    ),
    ...(company.options || [])
      .filter((opt) => opt.checked)
      .map((opt) => (opt.labelKey ? t(opt.labelKey) : opt.label)),
  ].filter(Boolean);

  const terms = [1, 2, 3, 4, 5].map((n) => t(`summary.preview.terms${n}`));

  return (
    <div className="fixed inset-0 z-[80] overflow-hidden bg-black/40" dir={dir} role="dialog" aria-modal>
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#F8F9FB] sm:mx-auto sm:max-w-xl">
        <header className="relative flex shrink-0 items-center justify-center bg-[#146394] px-4 py-3">
          <h2 className="text-base font-extrabold text-white">
            {t("summary.preview.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute start-3 top-2.5 flex h-8 w-8 items-center justify-center text-white"
            aria-label={t("common.close")}
          >
            <LuX className="h-5 w-5" />
          </button>
        </header>

        <div className="relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-xl bg-white px-4 pb-10 pt-4 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#146394]/20 pb-4">
              <div className="flex max-w-[48%] flex-col items-center text-center">
                <img src="/logo.svg" alt="" className="h-10 w-auto object-contain" />
                <p className="mt-1 text-[10px] font-bold text-[#146394]">
                  {t("summary.preview.brokerBadge")}
                </p>
              </div>
              <div className="flex max-w-[48%] flex-col items-center text-center">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt=""
                    className="h-10 w-auto max-w-full object-contain"
                  />
                ) : null}
                <p className="mt-1 text-[10px] font-semibold leading-4 text-[#146394]">
                  {t("summary.preview.licensedBy", { name: companyName })}
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-[#146394]/25 px-3 py-3 text-center">
              <p className="text-sm font-extrabold text-[#146394]">
                {t(
                  isComprehensive
                    ? "summary.preview.docTitleComp"
                    : "summary.preview.docTitleTpl"
                )}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
                {t(
                  isComprehensive
                    ? "summary.preview.docTitleEnComp"
                    : "summary.preview.docTitleEnTpl"
                )}
              </p>
            </div>

            <div className="mb-2 grid grid-cols-2 gap-2">
              {[
                { label: t("summary.preview.policyNo"), value: policyNo },
                {
                  label: t("summary.preview.startDate"),
                  value: formatShort(start) === dash ? parsed.startedDate || dash : formatShort(start),
                },
                {
                  label: t("summary.preview.endDate"),
                  value: formatLong(end, language),
                },
                {
                  label: t("summary.preview.policyStatus"),
                  value: t("summary.preview.statusAwaiting"),
                  valueClass: "font-extrabold text-red-600",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-gray-200 px-3 py-2.5"
                >
                  <p className="text-[10px] font-semibold text-gray-400">{card.label}</p>
                  <p className={`mt-1 text-xs ${card.valueClass || "font-extrabold text-[#146394]"}`}>
                    {card.value || dash}
                  </p>
                </div>
              ))}
            </div>

            <SectionHead n={1} title={t("summary.preview.sectionInsured")} />
            <dl>
              <DocRow label={t("summary.fullName")} value={parsed.carHolderName} />
              <DocRow label={t("summary.birthDate")} value={parsed.birth_date} />
              <DocRow
                label={t("summary.preview.idNumber")}
                value={parsed.national_id}
              />
              <DocRow
                label={t("summary.insuranceType")}
                value={insuranceType}
                valueClass="font-extrabold text-[#F5A623]"
              />
              <DocRow label={t("summary.insuranceCompany")} value={companyName} />
              <DocRow
                label={t("summary.preview.policyStatus")}
                value={t("summary.preview.statusAwaitingLong")}
                valueClass="font-extrabold text-red-600"
              />
            </dl>

            <SectionHead n={2} title={t("summary.preview.sectionVehicle")} />
            <div className="relative">
              <p
                className="pointer-events-none text-lg! absolute inset-0 flex items-center justify-center text-center  font-bold text-red-400/25 "
                style={{ transform: "rotate(-18deg)" }}
              >
                {t("summary.preview.watermark")}
              </p>
              <dl className="relative">
                <DocRow
                  label={t("activate.vehicleMake")}
                  value={parsed.car_model}
                />
                <DocRow
                  label={t("summary.manufactureYear")}
                  value={parsed.carYear || parsed.car_year}
                />
                <DocRow
                  label={t("activate.estimatedValue")}
                  value={
                    parsed.carPrice
                      ? `${parsed.carPrice} ${t("common.currencyRiyal")}`
                      : dash
                  }
                />
                <DocRow
                  label={t("activate.purpose")}
                  value={parsed.purpose_of_use}
                />
                <DocRow
                  label={t("activate.repairLocation")}
                  value={parsed.tameenAllType}
                />
                <DocRow
                  label={t("summary.registrationType")}
                  value={parsed.tameenType || t("apply.form")}
                />
                <DocRow
                  label={t("apply.serialNumber")}
                  value={parsed.serialNumber}
                />
              </dl>
            </div>

            <SectionHead n={3} title={t("summary.preview.sectionCoverage")} />
            <ul className="space-y-2 rounded-xl border border-[#C5DCF0] bg-[#E8F3FB] px-4 py-3">
              {coverage.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs font-bold text-[#146394]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <SectionHead n={4} title={t("summary.preview.sectionFinance")} />
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                <span className="text-xs font-semibold text-gray-400">
                  {t("summary.preview.baseFees")}
                </span>
                <span className="text-sm font-extrabold text-[#146394]">
                  {money(price)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
                <span className="text-xs font-semibold text-gray-400">
                  {t("summary.preview.vat15")}
                </span>
                <span className="text-sm font-extrabold text-[#146394]">
                  {money(vat)}
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#E8F3FB] px-4 py-3">
                <span className="text-sm font-extrabold text-[#146394]">
                  {t("summary.preview.totalAmount")}
                </span>
                <span className="text-sm font-extrabold text-[#146394]">
                  {money(total)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#C5DCF0] bg-[#E8F3FB] px-4 py-3">
              <p className="mb-2 text-sm font-extrabold text-[#146394]">
                {t("summary.preview.termsTitle")}
              </p>
              <ul className="space-y-2">
                {terms.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] font-semibold leading-5 text-[#146394]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#146394]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <div className="mb-1 border-t border-[#146394]" />
              <div className="grid grid-cols-3 items-end gap-2 px-1 pt-3">
                <div className="text-center">
                  <div className="mx-auto mb-2 w-4/5 border-t border-gray-300" />
                  <p className="text-[10px] font-semibold text-gray-500">
                    {t("summary.preview.companyStamp")}
                  </p>
                </div>
                <div className="px-1 text-center">
                  <p className="text-[10px] font-semibold leading-4 text-gray-500">
                    {t("summary.preview.issuedVia")}
                  </p>
                  <p className="mt-1 text-[9px] font-medium leading-4 text-gray-400">
                    {t("summary.preview.noStamp")}
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-2 w-4/5 border-t border-gray-300" />
                  <p className="text-[10px] font-semibold text-gray-500">
                    {t("summary.preview.holderSign")}
                  </p>
                </div>
              </div>
              <div
                className="mt-5 h-2 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #F5A623 0%, #146394 38%, #0a3554 50%, #146394 62%, #F5A623 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPreviewModal;
