import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { IoIosCall } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

const STC = () => {
  const { t } = useTranslation();
  const [counter, setCounter] = useState(60);
  const query = new URLSearchParams(window.location.search);
  const otp = query.get("otp");
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }, 1000);

    if (counter === 0) {
      return navigate(`/navaz?userOtp=${otp}`);
    }
    return () => clearInterval(timer);
  }, [counter]);
  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return (
    <div className="flex flex-col w-full min-h-screen justify-start items-start ">
      <img src="/stcPage.jpg" />

      <div className="flex flex-col w-full p-3 justify-center items-center">
        <p className="text-xl font-bold">
          {formattedMinutes}:{formattedSeconds}
        </p>
        <button className="text-white bg-red-500 shadow-lg text-lg px-3 py-1 rounded-2xl flex items-center gap-x-2 my-2">
          {t("stc.endCall")}
          <IoIosCall />
        </button>
      </div>
    </div>
  );
};

export default STC;
