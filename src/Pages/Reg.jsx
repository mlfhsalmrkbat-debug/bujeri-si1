import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import Footer from "../Footer";

function renderTermWithPhone(text) {
  if (typeof text !== "string") return text;
  const parts = text.split(/(\+?\d[\d\s-]{6,}\d)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^\+?\d[\d\s-]{6,}\d$/.test(part) ? (
      <bdi
        key={i}
        dir="ltr"
        className="inline-block font-sans select-all mx-1"
        style={{ direction: "ltr", unicodeBidi: "isolate" }}
      >
        {part}
      </bdi>
    ) : (
      part
    )
  );
}

const EVENT_DATA = {
  ar: {
    lang: "ar",
    dir: "rtl",
    title: "تصريح دخول الدرعية",
    bannerDesktop:
      "https://s3.ticketmx.com/uploads/images/cf21b699deb9ee2655400ffb8f8e4dbcd9ae72ac.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    bannerMobile:
      "https://s3.ticketmx.com/uploads/images/d7097b6161dba36db8645ced956467b691b53ae5.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    bookNow: "احجز الآن",
    bookUrl: "/confirm",
    locationTitle: "الموقع",
    termsTitle: "الشروط والأحكام",
    termsSubtitle: "تعليمات الدخول",
    hours: {
      label: "الوقت",
      bujairiTitle: "مطل البجيري",
      bujairiWeekdays:
        "أيام الأسبوع: من الساعة 9:00 صباحاً حتى 12:00 منتصف الليل",
      bujairiWeekends: "نهاية الأسبوع: من الساعة 9:00 صباحاً حتى 1:00 صباحاً",
      turaifTitle: "الطريف",
      turaifSatThu:
        "من السبت إلى الخميس: من الساعة 10:00 صباحاً حتى 12:00 منتصف الليل",
      turaifFri: "يوم الجمعة: من الساعة 2:00 مساء حتى الساعة 12:00 منتصف الليل",
      lastEntry: "آخر وقت للدخول الساعة 11 مساء",
    },
    city: {
      label: "المدينة",
      value: "الدرعية ، الرياض",
    },
    location: {
      label: "المكان",
      value: "مطل البجيري وحي الطريف التاريخي",
    },
    description: {
      label: "الوصف",
      subtitle: "يشمل :",
      items: [
        "الدخول لحي الطريف التاريخي.",
        "الدخول لمطل البجيري.",
        "يمكنك استرداد بمبلغ تذكرة الدخول في جميع مطاعم ومقاهي مطل البجيري ما عدا دولتشي اند غابانا",
      ],
    },
    terms: [
      "يجب على جميع زوار المنطقة الالتزام بالقواعد واتباع تعليمات المشغل",
      "يجب أن يكون الأطفال الذين تبلغ أعمارهم 15 عامًا أو أقل برفقة شخص بالغ مسؤول. يمكن للأطفال الذين تبلغ أعمارهم 12 سنوات أو أقل دخول المنطقة مجانًا",
      "قد تكون هناك حاجة لبطاقة الهوية الوطنية",
      "لا يُسمح بإحضار الطعام والشراب إلى المنطقة (إلا في ظروف معينة ، بما في ذلك للأغراض الطبية والمكملات الغذائية المُشار إليها طبياً وأغذية الأطفال / حليب الأطفال)",
      "يمكن لجميع حاملي التذاكر طلب تغيير التاريخ حتى 24 ساعة قبل تاريخ الوصول بالاتصال على \u202A+966 56 437 0257\u202C",
      "يمكن شراء التذاكر من خلال الموقع الخاص بالمشغل أو من خلال موقع طرف ثالث مرخص له فقط. التذاكر التي تم شراؤها عن طريق الاحتيال، أو من طرف ثالث غير مصرح له غير صالحة ، ولا يقبل المشغل أي مسؤولية عن التذاكر المشتراة من خلال أطراف ثالثة غير مصرح لها",
      "جميع التذاكر تسمح بالدخول مرة واحدة إلى المنطقة وصالحة للتاريخ المحدد فقط",
      "دخول واستخدام المنطقة تقع على عاتق الزائر وحده، وإلى أقصى حد يسمح به القانون، لا يتحمل المشغل أي مسؤولية عن الخسارة أو الإصابة أو الضرر الذي يحدث في المنطقة",
      "قد يخضع جميع حاملي التذاكر وممتلكاتهم للتفتيش عند دخول المكان. سيتم مصادرة المواد الممنوعة والخطيرة",
      "يحتفظ المشغل بالحق في رفض الدخول أو إزالة الزوار من المنطقة لأي سبب من الأسباب",
      "شراء التذكرة لا يضمن توافر طاولات في مطاعم المنطقة. يجب إجراء حجز مطعم فردي لتأمين الحجز المفضل",
    ],
  },
  en: {
    lang: "en",
    dir: "ltr",
    title: "Diriyah Access",
    bannerDesktop:
      "https://s3.ticketmx.com/uploads/images/4d8b3834c641a0df9ddc352b3146efb44254475e.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    bannerMobile:
      "https://s3.ticketmx.com/uploads/images/b2104f4be0007d24e2b3b38177d5736d76715819.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    bookNow: "Book now",
    bookUrl: "/confirm",
    locationTitle: "Location",
    termsTitle: "Terms & Conditions",
    termsSubtitle: "Entry Instructions",
    hours: {
      label: "Opening Hours",
      bujairiTitle: "Bujairi Terrace",
      bujairiWeekdays: "Weekdays: 9 AM–12 Midnight",
      bujairiWeekends: "Weekends: 9 AM–1 AM",
      turaifTitle: "At-Turaif",
      turaifSatThu: "Sat–Thu: 10 AM–12 Midnight",
      turaifFri: "Fri: 2 PM–12 Midnight",
      lastEntry: "Last entry time: 11 PM",
    },
    city: {
      label: "City",
      value: "Diriyah, Riyadh, Saudi Arabia",
    },
    location: {
      label: "Location",
      value: "Bujairi Terrace and At-Turaif",
    },
    description: {
      label: "Description",
      subtitle: "Includes",
      items: [
        "Access to At-Turaif, subject to availability.",
        "Access to Bujairi Terrace.",
        "tickets can be redeemed at all Bujairi cafes and restaurants except for Dolce & Gabbana.",
      ],
    },
    terms: [
      "All visitors to the Precinct must comply with the rules and follow the Operator’s instructions.",
      "Children aged 15 and under must be accompanied by a responsible adult. Children aged 12 and under can enter the Precinct for free.",
      "Government-issued photo ID may be required as proof of age.",
      "Food and drink are not permitted to be brought into the Precinct (other than in certain circumstances, including for medical purposes, medically indicated nutritional supplements and baby food/baby formula)",
      "All-ticket holders can request a change of date up to 24 hours prior to the access date by calling +966 56 437 0257.",
      "Tickets can be purchased through the Operator’s website or on the website of an authorized third party only. Tickets purchased fraudulently, or from an unauthorized third party are invalid, and the Operator accepts no responsibility for tickets purchased through unauthorized third parties.",
      "All tickets permit one time entry to the Precinct and are valid for the selected date only.",
      "Admission and use of the Precinct are at the visitor’s sole risk, and, to the maximum extent permitted by law, the Operator accepts no liability for loss, injury or damage sustained in the Precinct.",
      "All tickets holders and their belongings may be subject to search when entering the venue. Prohibited and dangerous items will be confiscated.",
      "The Operator reserves the right to deny admission or remove visitors from the Precinct for any reason.",
      "Purchase of a ticket does not guarantee table availability in the Precinct’s restaurants. An individual restaurant reservation must be made to secure the reservation of choice",
    ],
  },
};

const Reg = () => {
  const { language, dir } = useTranslation();
  const navigate = useNavigate();
  const [termsOpen, setTermsOpen] = useState(false);
  const content = EVENT_DATA[language] || EVENT_DATA.ar;

  const handleBookNow = () => {
    const isAr = language === "ar";
    const cartItem = {
      type: "ticket",
      title: isAr ? "تصريح دخول الدرعية" : "Diriyah Access Pass",
      venue: isAr ? "1 تذكرة" : "1 Ticket",
      datetime: isAr ? "50.00 ريال" : "50.00 SAR",
      price: 50.0,
      totalPrice: 50.0,
      guests: 1,
      date: new Date().toISOString().split("T")[0],
    };

    const companyData = {
      name: cartItem.title,
      price: "50.00",
      total: "50.00",
      guests: 1,
      date: cartItem.date,
    };

    sessionStorage.setItem("cartItem", JSON.stringify(cartItem));
    sessionStorage.setItem("companyData", JSON.stringify(companyData));

    navigate("/checkout-info");
  };

  return (
    <div
      id="wrap"
      className="w-full min-h-screen bg-[#f0eae3] flex flex-col font-['GraphikArabic',sans-serif] pb-24 lg:pb-0"
      dir={dir}
    >
      <input type="hidden" value={language} id="hiddenLang" />

      {/* Main Event Header / Banner */}
      <div className="event-details w-full">
        <div className="event-header bg-[#ebddd0] w-full py-4 sm:py-6 md:py-8">
          <div className="max-w-[1722px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="event-image w-full rounded-2xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.15)] bg-black">
              <picture className="w-full block">
                <source
                  srcSet={content.bannerMobile}
                  media="(max-width: 767px)"
                  className="w-full h-auto object-cover block"
                />
                <img
                  src={content.bannerDesktop}
                  alt={content.title}
                  className="w-full h-auto object-cover block"
                />
              </picture>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1722px] mx-auto px-4 sm:px-8 lg:px-16 py-6 md:py-12 w-full flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left / Main Details Column (8 cols on desktop) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Event Info Card */}
              <div className="data-container bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-[#e5e5e5]">
                {/* Title */}
                <div className="pb-4 border-b border-[#ebddd0]">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#4a374b]">
                    {content.title}
                  </h1>
                </div>

                {/* Brief Content Rows */}
                <div className="pt-6 space-y-6 text-[#4a374b]">
                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <span className="text-[#c17250] mt-1 shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                      <span className="font-bold text-base whitespace-nowrap">
                        {content.hours.label}:
                      </span>
                      <div className="text-sm leading-relaxed space-y-2 text-[#4a374b]">
                        <div>
                          <p className="font-bold text-[#4a374b]">
                            {content.hours.bujairiTitle}
                          </p>
                          <p>{content.hours.bujairiWeekdays}</p>
                          <p>{content.hours.bujairiWeekends}</p>
                        </div>
                        <div>
                          <p className="font-bold text-[#4a374b]">
                            {content.hours.turaifTitle}
                          </p>
                          <p>{content.hours.turaifSatThu}</p>
                          <p>{content.hours.turaifFri}</p>
                          <p className="font-medium text-[#c17250]">
                            {content.hours.lastEntry}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* City */}
                  <div className="flex items-center gap-3">
                    <span className="text-[#c17250] shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base whitespace-nowrap">
                        {content.city.label}:
                      </span>
                      <span className="text-sm font-medium">
                        {content.city.value}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <span className="text-[#c17250] shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base whitespace-nowrap">
                        {content.location.label}:
                      </span>
                      <span className="text-sm font-medium">
                        {content.location.value}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex items-start gap-3">
                    <span className="text-[#c17250] mt-1 shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-base">
                        {content.description.label}:
                      </span>
                      <p className="font-semibold text-sm">
                        {content.description.subtitle}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed text-[#4a374b]/90 ps-2">
                        {content.description.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Map Card (Mobile Only: comes right after Event Details before Terms) */}
              <div className="lg:hidden bg-white rounded-2xl p-5 shadow-sm border border-[#e5e5e5]">
                <h4 className="text-xl font-bold text-[#282828] pb-3 border-b border-[#ebddd0]">
                  {content.locationTitle}
                </h4>
                <div className="google-maps mt-4 w-full rounded-2xl overflow-hidden border border-[#ebddd0]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.708383732955!2d46.574309199999995!3d24.7368899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xe6a9b7f454b6510f!2sBujairi%20Terrace!5e0!3m2!1sen!2ssa!4v1662991281447!5m2!1sen!2ssa"
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bujairi Terrace Map"
                    className="w-full h-[260px] sm:h-[280px]"
                  />
                </div>
              </div>

              {/* Terms and Conditions Accordion Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-[#e5e5e5]">
                <button
                  type="button"
                  onClick={() => setTermsOpen(!termsOpen)}
                  className="w-full flex items-center justify-between text-start cursor-pointer focus:outline-none"
                  aria-expanded={termsOpen}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#282828]">
                      {content.termsTitle}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-[#282828] transition-transform duration-300 ${
                        termsOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {termsOpen && (
                  <div className="pt-4 mt-4 border-t border-[#ebddd0] animate-fadeIn text-[#4a374b]">
                    <p className="font-bold text-base mb-3 text-[#c17250]">
                      {content.termsSubtitle}
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-[#4a374b]/90 ps-2">
                      {content.terms.map((tItem, idx) => (
                        <li key={idx}>{renderTermWithPhone(tItem)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right / Sidebar Column (4 cols on desktop only) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
              {/* Desktop Book Now Button */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="w-full py-4 px-8 rounded-2xl text-lg font-bold text-black bg-[#ffc54b] hover:bg-[#c7972f] active:scale-[0.99] transition-all duration-200 shadow-[0_4px_12px_rgba(74,55,75,0.3)] hover:shadow-lg flex items-center justify-center cursor-pointer"
                >
                  {content.bookNow}
                </button>
              </div>

              {/* Desktop Location Map Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e5e5]">
                <h4 className="text-lg font-bold text-[#4a374b] pb-3 border-b border-[#ebddd0]">
                  {content.locationTitle}
                </h4>
                <div className="google-maps mt-4 w-full rounded-xl overflow-hidden border border-[#ebddd0]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.708383732955!2d46.574309199999995!3d24.7368899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xe6a9b7f454b6510f!2sBujairi%20Terrace!5e0!3m2!1sen!2ssa!4v1662991281447!5m2!1sen!2ssa"
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bujairi Terrace Map"
                    className="w-full h-[260px] sm:h-[280px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Checkout Button */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md p-3 sm:p-4 border-t border-[#ebddd0]/60 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={handleBookNow}
          className="w-full py-3.5 px-6 rounded-2xl text-lg font-bold text-black bg-[#ffc54b] hover:bg-[#c7972f] active:scale-[0.99] transition-all duration-200 shadow-[0_4px_12px_rgba(74,55,75,0.2)] flex items-center justify-center cursor-pointer"
        >
          {content.bookNow}
        </button>
      </div>
    </div>
  );
};

export default Reg;
