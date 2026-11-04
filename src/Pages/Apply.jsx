import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import Footer from "../Footer";

const PAGE_DATA = {
  ar: {
    lang: "ar",
    dir: "rtl",
    slides: [
      {
        id: 1,
        desktop:
          "https://s3.ticketmx.com/uploads/images/aa171b660bd3c7b66d6872ac7da5aefc433847f6.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
        mobile:
          "https://s3.ticketmx.com/uploads/images/afc7bdd846b3ae470aa877da91da29e7cc525a02.jpg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
        alt: "bujairi-access-pass",
      },
      {
        id: 2,
        desktop:
          "https://s3.ticketmx.com/uploads/images/53d4cad43cddd4fc9fc8330a31b012fa110598b1.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
        mobile:
          "https://s3.ticketmx.com/uploads/images/138582e78b777e1a826043ec625ff1be47a21267.jpg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
        alt: "الطريف",
      },
    ],
    upcomingTitle: "مطاعم البجيري وبطاقة الدخول",
    cards: [
      {
        id: "3552",
        name: "Diriyah Access",
        alt: "تصريح دخول الدرعية",
        city: "الدرعية ، الرياض",
        link: "/diriyah-access",
        image:
          "https://s3.ticketmx.com/uploads/images/d7097b6161dba36db8645ced956467b691b53ae5.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
      },
      {
        id: "4051",
        name: "Bujairi Restaurants",
        alt: "مطاعم البجيري",
        city: "الدرعية ، الرياض",
        link: "/restaurants",
        image:
          "https://s3.ticketmx.com/uploads/images/b5a2bff1036b521f3f46fa1d46412cf06ee0b958.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
      },
    ],
  },
  en: {
    lang: "en",
    dir: "ltr",
    slides: [
      {
        id: 1,
        desktop:
          "https://s3.ticketmx.com/uploads/images/5b771d257ba30f7c1728ee2e1e6ccf3ff6872c3b.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
        mobile:
          "https://s3.ticketmx.com/uploads/images/198cf77dbc974298d8858a7b23a8e1385c73e6dd.jpg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
        alt: "bujairi-access-pass",
      },
      {
        id: 2,
        desktop:
          "https://s3.ticketmx.com/uploads/images/5a0517dd0aa23d5c9da600a4a51d10dc586852c9.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
        mobile:
          "https://s3.ticketmx.com/uploads/images/aa69f9758d6a91c6e64fdf3ce0210ce696ccbdde.jpg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
        alt: "Al Traif",
      },
    ],
    upcomingTitle: "Bujairi Terrace booking options",
    cards: [
      {
        id: "3552",
        name: "Diriyah Access",
        alt: "Diriyah Access",
        city: "Diriyah, Riyadh, Saudi Arabia",
        link: "/diriyah-access",
        image:
          "https://s3.ticketmx.com/uploads/images/b2104f4be0007d24e2b3b38177d5736d76715819.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
      },
      {
        id: "4051",
        name: "Bujairi Restaurants",
        alt: "Bujairi Restaurants",
        city: "Diriyah, Riyadh, Saudi Arabia",
        link: "/restaurants",
        image:
          "https://s3.ticketmx.com/uploads/images/195fb7c4314a10d831b3e0611017f275c548d23c.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
      },
    ],
  },
};

const Apply = () => {
  const { language, dir } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const content = PAGE_DATA[language] || PAGE_DATA.ar;
  const slides = content.slides;

  // Autoplay banner slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      id="wrap"
      className="w-full min-h-screen bg-[#f0eae3] flex flex-col font-['GraphikArabic',sans-serif]"
      dir={dir}
    >
      <input type="hidden" value={language} id="hiddenLang" />

      {/* Banner Slider */}
      <div className="w-full px-4 sm:px-0 max-w-[1722px] mx-auto pt-3 sm:pt-0">
        <div className="w-full relative overflow-hidden rounded-2xl sm:rounded-none bg-black select-none shadow-[0_5px_10px_rgba(0,0,0,0.15)] sm:shadow-none">
          <div className="relative w-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`w-full transition-opacity duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 relative z-10"
                    : "opacity-0 absolute inset-0 z-0 pointer-events-none"
                }`}
              >
                <picture className="w-full block">
                  <source
                    srcSet={slide.desktop}
                    media="(min-width: 768px)"
                    className="w-full h-auto object-cover block"
                  />
                  <img
                    src={slide.mobile}
                    alt={slide.alt}
                    className="w-full h-auto object-cover block"
                  />
                </picture>
              </div>
            ))}

            {/* Slider Prev / Next Arrows */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute start-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            >
              <svg
                className={`w-5 h-5 md:w-6 md:h-6 ${dir === "rtl" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next"
              className="absolute end-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            >
              <svg
                className={`w-5 h-5 md:w-6 md:h-6 ${dir === "rtl" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Slick Dots */}
            <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full focus:outline-none cursor-pointer ${
                    index === currentSlide
                      ? "w-3 h-3 bg-[#4a374b]"
                      : "w-2.5 h-2.5 bg-[#4a374b]/40 hover:bg-[#4a374b]/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <section className="w-full flex-grow py-8 md:py-12 px-4 sm:px-8 lg:px-16 max-w-[1722px] mx-auto">
        <div className="main-title mb-6 text-start">
          <h2 className="title text-xl sm:text-2xl md:text-3xl font-bold text-[#4a374b]">
            {content.upcomingTitle}
          </h2>
        </div>

        {/* Grid Cards (All Internal Links) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {content.cards.map((card) => (
            <div key={card.id} className="w-full">
              <Link
                to={card.link}
                className="gtmProduct block group"
                data-event="productClick"
                data-product-name={card.name}
                data-product-id={card.id}
                data-product-brand="na"
                data-product-price="0.00"
                data-product-category="na"
                data-product-city={card.city}
                data-product-zone="na"
                data-product-position="1"
                data-product-venue="na"
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  className="event-img w-full h-auto object-cover rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl text-center font-bold text-base text-black bg-[#ffc54b] hover:bg-[#c7972f] shadow-sm transition-all cursor-pointer mt-4"
                >
                  {language === 'ar' ? "احجز الان" : "Book Now"}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
};

export default Apply;
