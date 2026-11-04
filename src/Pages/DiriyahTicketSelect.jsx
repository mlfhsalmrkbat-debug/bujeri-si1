import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import Footer from "../Footer";

const getDiriyahDates = (daysCount = 30) => {
  const arDays = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const arMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const enDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const enMonths = [
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

  const dates = [];
  const now = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    const year = d.getFullYear();
    const monthNum = String(d.getMonth() + 1).padStart(2, "0");
    const dayNum = String(d.getDate()).padStart(2, "0");
    const value = `${year}-${monthNum}-${dayNum}`;

    const dayNameAr = arDays[d.getDay()];
    const dayNameEn = enDays[d.getDay()];
    const monthNameAr = arMonths[d.getMonth()];
    const monthNameEn = enMonths[d.getMonth()];

    const dayLabelAr = i === 0 ? "اليوم" : i === 1 ? "غدا" : dayNameAr;
    const dayLabelEn = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNameEn;

    dates.push({
      value,
      day: d.getDate(),
      monthAr: monthNameAr,
      monthEn: monthNameEn,
      dayNameAr: dayLabelAr,
      dayNameEn: dayLabelEn,
      fullLabelAr: `${dayNameAr}، ${dayNum} ${monthNameAr} ${year}`,
      fullLabelEn: `${dayNameEn}, ${dayNum} ${monthNameEn} ${year}`,
    });
  }

  return dates;
};

const DiriyahTicketSelect = () => {
  const { language, dir } = useTranslation();
  const isAr = language === "ar";
  const navigate = useNavigate();

  const dates = useMemo(() => getDiriyahDates(30), []);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const [quantity, setQuantity] = useState(() => {
    try {
      const stored = sessionStorage.getItem("cartItem");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.guests && parsed.guests >= 1 && parsed.guests <= 8) {
          return Number(parsed.guests);
        }
      }
    } catch {}
    return 1;
  });

  const selectedDate = dates[selectedDateIndex] || dates[0];
  const pricePerTicket = 50.0;
  const totalPrice = quantity * pricePerTicket;

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: isAr ? "تصريح دخول الدرعية" : "Diriyah Access Pass",
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(isAr ? "تم نسخ الرابط بنجاح" : "Link copied to clipboard");
    }
  };

  const handleBuyNow = () => {
    const timeSlot = isAr ? "05:00 م - 12:00 ص" : "05:00 PM - 12:00 AM";

    let existingCart = {};
    try {
      existingCart = JSON.parse(sessionStorage.getItem("cartItem") || "{}");
    } catch {}

    const updatedCart = {
      ...existingCart,
      type: "ticket",
      title: isAr ? "تصريح دخول الدرعية" : "Diriyah Access Pass",
      venue: isAr
        ? `${quantity} ${quantity === 1 ? "تذكرة" : "تذاكر"}`
        : `${quantity} ${quantity === 1 ? "Ticket" : "Tickets"}`,
      datetime: `${isAr ? selectedDate.fullLabelAr : selectedDate.fullLabelEn} | ${timeSlot}`,
      price: pricePerTicket,
      totalPrice: totalPrice,
      guests: quantity,
      quantity: quantity,
      date: selectedDate.value,
      dateFormatted: isAr ? selectedDate.fullLabelAr : selectedDate.fullLabelEn,
      time: timeSlot,
    };

    const companyData = {
      name: updatedCart.title,
      price: String(totalPrice),
      total: String(totalPrice),
      totalPrice: totalPrice,
      guests: quantity,
      quantity: quantity,
      date: selectedDate.value,
      time: timeSlot,
    };

    sessionStorage.setItem("cartItem", JSON.stringify(updatedCart));
    sessionStorage.setItem("companyData", JSON.stringify(companyData));
    sessionStorage.setItem("totalPrice", String(totalPrice));

    navigate(isAr ? "/ar/summary" : "/en/summary");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f0eae3] font-['GraphikArabic',sans-serif] text-[#2d242f]"
      dir={dir}
    >
      {/* TicketMX Bujairi Header */}
      <div className="w-full bg-[#4a374b] py-5 sm:py-6 px-4 sm:px-6 lg:px-8 border-b border-[#3b2a3c]">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Title + Share Icon */}
          <div className="flex items-center gap-4 order-2 lg:order-1 text-center lg:text-start justify-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {isAr ? "تصريح دخول الدرعية" : "Diriyah Access Pass"}
            </h1>
            <button
              type="button"
              onClick={handleShare}
              className="text-white/80 hover:text-white p-1.5 transition-colors cursor-pointer"
              title={isAr ? "مشاركة هذه الصفحة" : "Share this page"}
              aria-label="Share"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
            </button>
          </div>

          {/* Stepper (Step 1 visited, Step 2 active, Step 3 inactive) */}
          <div className="w-full lg:w-auto min-w-[280px] sm:min-w-[380px] order-1 lg:order-2">
            <div className="relative flex items-center justify-between">
              {/* Connecting line behind circles */}
              {/* Part 1 (Step 1 to Step 2): Active Yellow */}
              <div
                className={`absolute top-[7px] h-[2px] bg-[#ffc54b] z-0 ${
                  dir === "rtl"
                    ? "right-[15%] left-[50%]"
                    : "left-[15%] right-[50%]"
                }`}
              />

              {/* Part 2 (Step 2 to Step 3): Inactive dim */}
              <div
                className={`absolute top-[7px] h-[2px] bg-white/20 z-0 ${
                  dir === "rtl"
                    ? "left-[15%] right-[50%]"
                    : "right-[15%] left-[50%]"
                }`}
              />

              {/* Step 1: Visited (Yellow) */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffc54b] ring-4 ring-[#ffc54b]/30 mb-2" />
                <span className="text-xs sm:text-sm font-bold text-[#ffc54b] text-center">
                  {isAr ? "تسجيل دخول" : "Login"}
                </span>
              </div>

              {/* Step 2: Active (Yellow) */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffc54b] ring-4 ring-[#ffc54b]/30 mb-2" />
                <span className="text-xs sm:text-sm font-bold text-[#ffc54b] text-center">
                  {isAr ? "اختيار التذاكر" : "Select Tickets"}
                </span>
              </div>

              {/* Step 3: Inactive (White) */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-white/40 mb-2" />
                <span className="text-xs sm:text-sm font-medium text-white/60 text-center">
                  {isAr ? "إتمام الشراء" : "Complete Purchase"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dates and Times Row */}
      <div className="w-full bg-white shadow-sm border-b border-[#e5dcd3] py-4">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col items-center gap-4">
          {/* Dynamic 30-Day Date Cards */}
          <div className="w-full flex items-center justify-start lg:justify-center gap-2.5 sm:gap-3 overflow-x-auto py-2 no-scrollbar scroll-smooth">
            {dates.map((item, idx) => {
              const isSelected = selectedDateIndex === idx;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedDateIndex(idx)}
                  className={`shrink-0 w-[68px] sm:w-[74px] py-2 px-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-[#4a374b] bg-white shadow-sm ring-1 ring-[#4a374b]/10 scale-[1.02]"
                      : "border border-gray-200 bg-white hover:border-gray-400 text-gray-500"
                  }`}
                >
                  {/* Month */}
                  <span
                    className={`text-[11px] font-medium leading-none mb-1 ${
                      isSelected ? "text-[#4a374b] font-semibold" : "text-gray-500"
                    }`}
                  >
                    {isAr ? item.monthAr : item.monthEn}
                  </span>

                  {/* Day Number */}
                  <span
                    className={`text-xl sm:text-2xl font-bold leading-tight my-0.5 ${
                      isSelected ? "text-[#2d242f]" : "text-gray-700"
                    }`}
                  >
                    {item.day}
                  </span>

                  {/* Day Label (اليوم / غدا / day name) */}
                  <span
                    className={`text-[11px] font-medium leading-none mt-1 ${
                      isSelected ? "text-[#4a374b] font-bold" : "text-gray-500"
                    }`}
                  >
                    {isAr ? item.dayNameAr : item.dayNameEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time Slot Pill */}
          <div className="w-full flex justify-center pt-1">
            <button
              type="button"
              className="border-2 border-[#4a374b] rounded-xl px-7 sm:px-9 py-2 sm:py-2.5 bg-white text-[#4a374b] font-bold text-sm sm:text-base tracking-wide shadow-sm hover:bg-[#4a374b]/5 transition-colors cursor-pointer"
            >
              {isAr ? "05:00 م - 12:00 ص" : "05:00 PM - 12:00 AM"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Ticket Quantity & Purchase Card */}
      <div className="flex-grow py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-[700px] mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e5dcd3] overflow-hidden">
            {/* Header */}
            <div className="bg-[#4a374b] text-white py-4 px-6 text-center">
              <h2 className="text-xl sm:text-2xl font-bold">
                {isAr ? "الرجاء الاختيار" : "Please select"}
              </h2>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-7 space-y-4">
              {/* Ticket Row */}
              <div className="bg-[#f9f8f6] rounded-2xl border border-[#ebe5df] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Title */}
                <div className="text-center sm:text-start">
                  <span className="font-bold text-base sm:text-lg text-[#2d242f]">
                    {isAr
                      ? "دخول الدرعية - (الحد الأقصى 8)"
                      : "Diriyah Access - (Max 8)"}
                  </span>
                </div>

                {/* Price */}
                <div className="text-base sm:text-lg font-bold text-[#2d242f] text-center">
                  {isAr ? "50.00 ريال" : "50.00 SAR"}
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>

                  <span className="font-bold text-lg min-w-[32px] text-center text-[#2d242f]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(8, q + 1))}
                    disabled={quantity >= 8}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Total Row */}
              <div className="bg-[#f2eee9] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <span className="font-bold text-lg sm:text-xl text-[#2d242f]">
                  {isAr ? "الإجمالي" : "Total"}
                </span>
                <span className="font-bold text-lg sm:text-xl text-[#2d242f]">
                  {totalPrice} {isAr ? "ريال" : "SAR"}
                </span>
              </div>
            </div>
          </div>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full mt-6 py-4 px-8 rounded-2xl text-lg sm:text-xl font-bold text-[#2d242f] bg-[#ffc54b] hover:bg-[#f0b535] active:scale-[0.99] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
          >
            {isAr ? "اشتر الآن" : "Buy Now"}
          </button>
        </div>
      </div>

      {/* Fixed Green Toast Badge (Bottom Left, matches TicketMX desktop layout) */}
      <div className="fixed bottom-0 start-0 z-40 bg-[#28a745] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-tr-lg shadow-lg hidden md:block">
        <div>{isAr ? "تم الحجز والوقت المتاح لاتمام الحجز" : "Booking started, time remaining to complete"}</div>
        <div>{isAr ? "هو 10 دقائق" : "is 10 minutes"}</div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DiriyahTicketSelect;

