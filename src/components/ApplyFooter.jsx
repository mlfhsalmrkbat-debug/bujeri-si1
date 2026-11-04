import { useState } from "react";
import { useTranslation } from "../context/LanguageContext";
import {
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaCommentDots,
} from "react-icons/fa6";
import { LuChevronDown } from "react-icons/lu";

const FOOTER_COLUMNS = [
  {
    titleKey: "apply.footerAbout",
    links: [
      "apply.footerWareef",
      "apply.footerPrivacy",
      "apply.footerTerms",
      "apply.footerJobs",
    ],
  },
  {
    titleKey: "apply.footerProducts",
    links: [
      "apply.footerMotor",
      "apply.footerMedical",
      "apply.footerTravel",
      "apply.footerMedicalErrors",
      "apply.footerDomestic",
    ],
  },
  {
    titleKey: "apply.footerSupport",
    links: [
      "apply.footerBlog",
      "apply.footerCancel",
      "apply.footerTicket",
      "apply.footerPrint",
    ],
  },
  {
    titleKey: "apply.footerLinks",
    links: [
      "apply.footerAuthority",
      "apply.footerComplaint",
      "apply.footerRegulations",
      "apply.footerVat",
    ],
  },
];

const SOCIAL = [
  { Icon: FaFacebookF, href: "https://facebook.com/Bcareksa-115093535762889" },
  { Icon: FaInstagram, href: "http://instagram.com/bcareksa" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/company/bcareksa" },
  { Icon: null, href: "https://twitter.com/bcareksa", label: "𝕏" },
  { Icon: FaCommentDots, href: "tel:8001180044" },
  {
    Icon: FaYoutube,
    href: "https://www.youtube.com/channel/UCAuOCfNoaW8xTCFAMI38Anw",
  },
];

const FooterColumn = ({ titleKey, links, t, open, onToggle }) => (
  <div className="">
    <button
      type="button"
      className="flex w-full items-center justify-between py-3 text-right md:pointer-events-none md:cursor-default md:py-0"
      onClick={onToggle}
    >
      <h6 className="font-semibold">{t(titleKey)}</h6>
      <LuChevronDown
        className={`h-4 w-4 transition-transform md:hidden ${open ? "rotate-180" : ""}`}
      />
    </button>
    <div className={`${open ? "block pb-3" : "hidden"} md:block`}>
      {links.map((linkKey) => (
        <a
          key={linkKey}
          href="#"
          className="mt-1 block text-xs hover:text-yellow-400"
        >
          {t(linkKey)}
        </a>
      ))}
    </div>
  </div>
);

const ApplyFooter = () => {
  const { t, dir } = useTranslation();
  const [openKey, setOpenKey] = useState(null);

  return (
    <footer className="mt-8 w-full bg-[#146394] text-white" dir={dir}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <img
          loading="lazy"
          src="/footer/logo-bcare-white.svg"
          alt="BCare"
          className="w-24"
        />
        <div className="mt-3 flex items-center text-white">
          <FaPhone className="-rotate-90 text-xl" />
          <span className="mx-2 text-lg font-bold">8001180044</span>
        </div>

        <div className="mt-5 flex  justify-start gap-2">
          <a href="#" className="cursor-pointer">
            <img
              className="h-10 w-auto"
              src="/footer/FooterImage/huawei-store.svg"
              alt="Huawei AppGallery"
            />
          </a>
          <a href="#" className="cursor-pointer">
            <img
              className="h-10 w-auto"
              src="/footer/FooterImage/apple-store.svg"
              alt="App Store"
            />
          </a>
          <a href="#" className="cursor-pointer">
            <img
              className="h-10 w-auto"
              src="/footer/FooterImage/google-store.svg"
              alt="Google Play"
            />
          </a>
        </div>

        <div className="mt-4 flex flex-col md:mt-8 md:grid md:grid-cols-4 md:gap-6">
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn
              key={column.titleKey}
              {...column}
              t={t}
              open={openKey === column.titleKey}
              onToggle={() =>
                setOpenKey((current) =>
                  current === column.titleKey ? null : column.titleKey,
                )
              }
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start  border-white/30 pt-5">
          <div className="flex justify-center gap-2 flex-row-reverse ">
            {SOCIAL.map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border bg-white border-white text-sm"
              >
                {Icon ? <Icon className="text-[#146394]" /> : label}
              </a>
            ))}
          </div>
          <p className="mt-6 text-center text-xs">
            {t("apply.footerCopyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ApplyFooter;
