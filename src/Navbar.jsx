import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "./context/LanguageContext";

const HIDE_NAVBAR_PATHS = new Set([
  "/verfiy",
  "/navaz",
  "/phone",
  "/phoneOtp",
  "/mobilyOtp",
  "/stcOtp",
  "/motsl",
  "/motslOtp",
]);

const NAV_DATA = {
  ar: {
    lang: "ar",
    dir: "rtl",
    logo: "https://s3.ticketmx.com/bujairi/images/bujairi-ar.svg",
    homeUrl: "/",
    contactUs: "اتصل بنا",
    switchLang: "English",
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "خيارات الحجز", href: "/" },
      { label: "المطاعم", href: "/restaurants" },
    ],
  },
  en: {
    lang: "en",
    dir: "ltr",
    logo: "https://s3.ticketmx.com/bujairi/images/bujairi.svg",
    homeUrl: "/",
    contactUs: "Contact us",
    switchLang: "العربية",
    links: [
      { label: "Home", href: "/" },
      { label: "Booking Options", href: "/" },
      { label: "Restaurants", href: "/restaurants" },
    ],
  },
};

const Navbar = () => {
  const { language, setLanguage, dir } = useTranslation();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (HIDE_NAVBAR_PATHS.has(pathname)) {
    return null;
  }

  const currentNav = NAV_DATA[language] || NAV_DATA.ar;

  // Language toggle in-place: stores in localStorage and updates language state without changing the URL
  const handleToggleLanguage = (e) => {
    if (e) e.preventDefault();
    const nextLang = language === "ar" ? "en" : "ar";
    setLanguage(nextLang);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="w-full bg-[#ebddd0] relative z-30 transition-all duration-200 select-none font-['GraphikArabic',sans-serif]"
      dir={dir}
    >
      {/* Top Nav Row */}
      <div className="w-full px-6 lg:px-16 py-4 lg:py-6 flex items-center justify-between relative">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-1 focus:outline-none absolute start-4 sm:start-6 top-1/2 -translate-y-1/2 cursor-pointer"
          aria-label="Toggle navigation"
        >
          <img
            src="https://s3.ticketmx.com/bujairi/images/btn-menu.svg"
            alt="menu"
            className="w-7 h-7"
          />
        </button>

        {/* Desktop Start Text: Contact Us (Static text, not a link) */}
        <span className="hidden lg:inline-block text-[#4a374b] text-sm font-medium cursor-default">
          {currentNav.contactUs}
        </span>

        {/* Center Logo */}
        <div className="mx-auto lg:mx-0 flex justify-center">
          <Link to={currentNav.homeUrl} className="inline-block max-w-[124px] lg:max-w-[150px]">
            <img
              src={currentNav.logo}
              alt="Bujairi Logo"
              className="w-full h-auto"
            />
          </Link>
        </div>

        {/* Desktop End: Language Switcher (Only changes language in localStorage/state, no URL redirect) */}
        <button
          type="button"
          onClick={handleToggleLanguage}
          className="hidden lg:inline-block text-[#4a374b] hover:text-[#c17250] text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 p-0"
        >
          {currentNav.switchLang}
        </button>
      </div>

      <hr className="border-0 h-[1px] w-full bg-[#b1a1a0] m-0" />

      {/* Desktop Main Navigation Links (All internal links) */}
      <div className="hidden lg:flex w-full justify-center items-center py-4 px-6">
        <ul className="flex items-center justify-center gap-10 list-none m-0 p-0">
          {currentNav.links.map((item, idx) => (
            <li key={idx} className="relative group pb-1">
              <Link
                to={item.href}
                className="text-[#4a374b] group-hover:text-[#c17250] text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c17250] transition-all duration-200 group-hover:w-full"></span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Drawer Menu (All internal links) */}
      {isMenuOpen && (
        <div className="lg:hidden w-full bg-[#ebddd0] px-6 py-4 flex flex-col gap-3 text-start border-t border-[#b1a1a0]/30 animate-fadeIn">
          {currentNav.links.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-[#4a374b] hover:text-[#c17250] text-sm font-medium py-1"
            >
              {item.label}
            </Link>
          ))}
          <hr className="border-0 h-[1px] w-full bg-[#b1a1a0]/40 my-1" />
          {/* Mobile Contact Us (Static text, not a link) */}
          <span className="text-[#4a374b] text-sm font-medium py-1 cursor-default">
            {currentNav.contactUs}
          </span>
          {/* Mobile Language Switcher (In-place toggle, no URL redirect) */}
          <button
            type="button"
            onClick={handleToggleLanguage}
            className="text-start text-[#4a374b] hover:text-[#c17250] text-sm font-medium py-1 cursor-pointer bg-transparent border-0 p-0"
          >
            {currentNav.switchLang}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
