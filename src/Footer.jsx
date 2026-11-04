import React from "react";
import { useTranslation } from "./context/LanguageContext";

const FOOTER_DATA = {
  ar: {
    copyright: "Copyright 2024 DGCL. All Rights Reserved",
    phone: "+966 56 437 0257",
    tel: "00966920021727",
  },
  en: {
    copyright: "Copyright 2024 DGCL. All Rights Reserved",
    phone: "+966 56 437 0257",
    tel: "00966920021727",
  },
};

const Footer = () => {
  const { language, dir } = useTranslation();
  const content = FOOTER_DATA[language] || FOOTER_DATA.ar;

  return (
    <footer
      id="footer"
      className="footer__bujairi w-full bg-[#ebddd0] text-[#4a374b] mt-auto select-none font-['GraphikArabic',sans-serif]"
      dir={dir}
    >
      <div className="max-w-[1722px] mx-auto px-6 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-normal">
        <span className="copyright order-2 md:order-1 text-xs sm:text-sm text-[#4a374b]">
          {content.copyright}
        </span>
        <a
          href={`tel:${content.tel}`}
          className="phone flex items-center gap-2 hover:text-[#c17250] transition-colors order-1 md:order-2"
        >
          <img
            src="https://s3.ticketmx.com/bujairi/images/phone.svg"
            alt="phone"
            className="w-4 h-4 mx-2"
          />
          <span
            dir="ltr"
            className="font-medium text-xs sm:text-sm text-[#4a374b]"
          >
            {content.phone}
          </span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
