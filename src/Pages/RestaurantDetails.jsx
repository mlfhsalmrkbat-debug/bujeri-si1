import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import Footer from "../Footer";
import { getRestaurantByIdOrSlug } from "../constants/restaurantsDetailsData";

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

const TERMS = {
  ar: [
    "يلتزم الضيف بالحجز، والوصول في الوقت المحدد.",
    "يلتزم الضيف بعدم الحجز المتكرر لعدة مطاعم في نفس الوقت. كما يُحظر إعادة بيع الحجوزات، حيث قد تضطر الإدارة لإلغاء الحجز في مثل هذه الحالات.",
    "جميع الحجوزات تسمح بالدخول مرة واحدة إلى المنطقة وصالحة للتاريخ المحدد فقط.",
    "تخضع جميع الحجوزات لتوفر المطاعم للوقت والتاريخ ونوع الحفل المحدد، مع العلم أن تأكيد الحجز يتم بعد تلقي الضيف رسالة تأكيد بالبريد الإلكتروني.",
    "لا يمكن حجز الحفلات المجموعات التي يزيد عدد أفرادها عن 8 أشخاص إلا عن طريق الاتصال بالمطعم مباشرةً.",
    "تلتزم الدرعية بتقديم خدمات عالية الجودة للزوّار وللمرافق التابعة لها، وذلك حرصًا منها على الحفاظ على أعلى مستويات الخدمة والضيافة. ولذا يتحتم على الزوّار إلغاء أو تعديل أي حجوزات قبل 24 ساعة على الأقل من يوم الحجز عبر الاتصال بخدمة العملاء: \u202A+966 56 437 0257\u202C.",
    "يملك كل مطعم سياسته الخاصة فيما يتعلق بعدم الحضور بعد الحجز.",
    "يرجى مراجعة سياسة المطعم المحددة فيما يتعلق بالعمر المسموح لدخول المطاعم (إن وجدت). أو الاتصال بخدمة العملاء لمزيد من المعلومات: \u202A+966 56 437 0257\u202C.",
    "جميع المبالغ التي تم دفعها للحجز غير مستردة في حال عدم الحضور أو إلغاء الحجوزات بعد 24 ساعة من تاريخ الحجز.",
    "للمزيد من المعلومات الرجاء الاتصال بخدمة العملاء على الرقم: \u202A+966 56 437 0257\u202C.",
  ],
  en: [
    "Guests must adhere to the reservation and arrive on time.",
    "Guests must not make duplicate bookings across multiple restaurants at the same time. Resale of bookings is prohibited.",
    "All bookings grant single entry to the area and are valid for the selected date only.",
    "All bookings are subject to restaurant availability for the specified date, time, and party size.",
    "Group bookings of more than 8 guests must be arranged directly with the restaurant.",
    "Diriyah is committed to high-standard hospitality. Any cancellations or amendments must be made at least 24 hours prior by contacting customer care: +966 56 437 0257.",
    "Each restaurant enforces its own no-show policy.",
    "Please check restaurant-specific policies regarding minimum age limits (if any) or contact customer service: +966 56 437 0257.",
    "All booking payments are non-refundable for no-shows or cancellations within 24 hours of the reserved date.",
    "For more information, contact customer service at: +966 56 437 0257.",
  ],
};

const RestaurantDetails = () => {
  const { id, slug } = useParams();
  const { language, dir } = useTranslation();
  const navigate = useNavigate();

  const restaurant = useMemo(() => {
    return getRestaurantByIdOrSlug(id || slug) || getRestaurantByIdOrSlug("1");
  }, [id, slug]);

  const [guests, setGuests] = useState(restaurant?.defaultGuests || 1);
  const [selectedDate, setSelectedDate] = useState(
    restaurant?.dates?.[0]?.value || "",
  );
  const [selectedTime, setSelectedTime] = useState(
    restaurant?.times?.[0]?.id || "",
  );
  const [isTermsOpen, setIsTermsOpen] = useState(true);

  const isAr = language === "ar";
  const localized = restaurant ? restaurant[language] || restaurant.ar : null;
  const termsList = TERMS[language] || TERMS.ar;

  const pricePerPerson = restaurant?.pricePerPerson || 50;
  const totalPrice = guests * pricePerPerson;

  const handleIncrement = () => {
    if (restaurant && guests < restaurant.maxGuests) {
      setGuests((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (restaurant && guests > restaurant.minGuests) {
      setGuests((prev) => prev - 1);
    }
  };

  const handleCheckout = (e) => {
    if (e) e.preventDefault();
    if (!restaurant) return;

    const guestText = isAr
      ? `${guests} ${guests === 1 ? "ضيف" : guests === 2 ? "ضيفان" : guests <= 10 ? "ضيوف" : "ضيف"}`
      : `${guests} ${guests === 1 ? "Guest" : "Guests"}`;

    const dateVal = selectedDate || restaurant.dates?.[0]?.value;

    const cartItem = {
      type: "restaurant",
      restaurantId: restaurant.id,
      title: localized.title,
      venue: guestText,
      datetime: `${pricePerPerson.toFixed(2)} ${isAr ? "ريال" : "SAR"}`,
      price: pricePerPerson,
      totalPrice,
      guests,
      date: dateVal,
      timeId: selectedTime,
    };

    const companyData = {
      name: localized.title,
      price: String(totalPrice),
      total: String(totalPrice),
      guests,
      date: dateVal,
      timeId: selectedTime,
    };

    sessionStorage.setItem("cartItem", JSON.stringify(cartItem));
    sessionStorage.setItem("companyData", JSON.stringify(companyData));
    sessionStorage.setItem(
      "restaurantBooking",
      JSON.stringify({ ...cartItem, companyData }),
    );

    navigate("/checkout-info");
  };

  if (!restaurant || !localized) {
    return null;
  }

  return (
    <div
      className="w-full min-h-screen bg-[#f0eae3] flex flex-col font-['GraphikArabic',sans-serif] text-[#2d242f]"
      dir={dir}
    >
      {/* Hero Section */}
      <div className="w-full relative">
        <div className="w-full max-w-[1550px] mx-auto">
          {/* Cover Image */}
          <div className="w-full h-[210px] sm:h-[320px] md:h-[440px] lg:h-[500px] overflow-hidden bg-black/10">
            <img
              src={restaurant.banner}
              alt={localized.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Overlapping Logo Bar */}
          <div className="px-4 sm:px-6 lg:px-8 relative -mt-[30px] sm:-mt-[65px] lg:-mt-[90px] z-10 flex items-end justify-between">
            {/* Desktop & Mobile Logo Box */}
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="w-[85px] h-[85px] sm:w-[125px] sm:h-[125px] lg:w-[170px] lg:h-[170px] rounded-2xl bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.15)] p-2 sm:p-3 flex items-center justify-center shrink-0">
                <img
                  src={restaurant.logo}
                  alt={localized.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Mobile Only Title & Type next to Logo */}
              <div className="lg:hidden pb-1 ">
                <h1 className="text-base sm:text-xl font-bold text-[#2d242f] leading-tight mt-10  ">
                  {localized.title}
                </h1>
                {localized.type ? (
                  <p className="text-xs sm:text-sm text-[#777] font-medium mt-0.5">
                    {localized.type}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Mobile Description (Sits directly on page background as in screenshot 1) */}
          <div className="lg:hidden px-4 sm:px-6 mt-4 text-[#333] text-xs sm:text-sm leading-relaxed text-start">
            <div
              className="space-y-3"
              dangerouslySetInnerHTML={{ __html: localized.desc }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-8 flex-grow">
        {/* DESKTOP LAYOUT (Image 2): 2 Columns (Main col-8 on Right, Sidebar col-4 on Left in RTL) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          {/* Main Column (8 cols on Desktop) */}
          <div className="col-span-8 flex flex-col gap-6">
            {/* Card 1: Title & Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#eae3db]">
              <div className="flex items-center justify-between pb-3">
                <h1 className="text-2xl xl:text-3xl font-bold text-[#2d242f]">
                  {localized.title}
                </h1>
                {localized.type ? (
                  <span className="text-base font-normal text-[#777]">
                    {localized.type}
                  </span>
                ) : null}
              </div>
              <hr className="border-t border-[#eae3db] my-3" />
              <div
                className="text-sm xl:text-base leading-relaxed text-[#444] text-start pt-1"
                dangerouslySetInnerHTML={{ __html: localized.desc }}
              />
            </div>

            {/* Card 2: Reservation ("الحجز") */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#eae3db]">
              <h2 className="text-xl font-bold text-[#2d242f] text-start pb-2">
                {isAr ? "الحجز" : "Reservation"}
              </h2>
              <hr className="border-t border-[#eae3db] my-3" />

              {/* Inclusions */}
              <div className="text-start text-xs xl:text-sm text-[#444] mb-5">
                <p className="font-bold text-[#2d242f] mb-2">
                  {isAr ? "الحجز يشمل" : "Reservation includes"}
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-[#555]">
                  <li>
                    {isAr
                      ? "الدخول لمنطقة مطل البجيري التي تعد أفضل وجهة تضم عدد من أرقى المطاعم العالمية والمحلية."
                      : "Access to Bujairi Terrace, home to prestigious local and international dining."}
                  </li>
                  <li>
                    {isAr
                      ? "إمكانية الدخول لحي الطريف التاريخي، مع خيار حجز جولة بصحبة مرشد سياحي للتعرف على المنطقة."
                      : "Access to historic At-Turaif district, with optional guided tour."}
                  </li>
                  <li>
                    {isAr
                      ? "استرداد قيمة رسوم الحجز من مبلغ الفاتورة."
                      : "Redemption of the booking fee against your restaurant bill."}
                  </li>
                </ul>
              </div>

              {/* Controls Row: Date on Right (start), Guest Count on Left (end) */}
              <div className="grid grid-cols-12 gap-4 items-center mb-6 pt-2">
                {/* Guest Selector (Right side in RTL) */}
                <div className="col-span-6 flex items-center justify-between bg-white border border-gray-300 rounded-xl p-3">
                  <span className="text-xs xl:text-sm text-[#333] font-medium whitespace-nowrap">
                    {isAr ? "عدد الضيوف" : "Number of Guests"} (
                    {restaurant.minGuests} - {restaurant.maxGuests})
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={guests <= restaurant.minGuests}
                        className="w-8 h-8 rounded-full border border-[#d9d0c7] bg-white flex items-center justify-center font-bold text-base hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-[#2d242f]">
                        {guests}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={guests >= restaurant.maxGuests}
                        className="w-8 h-8 rounded-full border border-[#d9d0c7] bg-white flex items-center justify-center font-bold text-base hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                {/* Date Dropdown (Left side in RTL) */}
                <div className="col-span-6 ">
                  <select
                    value={selectedDate || restaurant.dates?.[0]?.value}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-[#d9d0c7] rounded-xl p-4 text-sm font-medium text-[#2d242f] focus:outline-none focus:border-[#4a374b] cursor-pointer"
                  >
                    {restaurant.dates.slice(0, 10)?.map((d) => (
                      <option key={d.value} value={d.value}>
                        {isAr ? d.labelAr : d.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots Row */}
              <div className="mb-6">
                {restaurant.times && restaurant.times.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {restaurant.times.map((t) => {
                      const active = selectedTime === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTime(t.id)}
                          className={`w-[66px] h-[58px] rounded-xl flex flex-col items-center justify-center shrink-0 border transition-all cursor-pointer ${
                            active
                              ? "bg-[#3d2b3f] text-white border-[#3d2b3f] shadow-xs"
                              : "bg-white text-[#3d2b3f] border-[#d9d0c7] hover:bg-[#faf6f2]"
                          }`}
                        >
                          <span className="text-xs font-semibold leading-tight">
                            {t.timeNum}
                          </span>
                          <span className="text-[11px] font-medium leading-tight">
                            {isAr ? t.ampmAr : t.ampmEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-[#e8f3fb] text-[#146394] p-3 rounded-xl text-xs text-center font-medium">
                    {isAr ? "لا توجد أوقات متاحة" : "No times available"}
                  </div>
                )}
              </div>

              {/* Total Row */}
              <div className="flex items-center justify-between p-3.5 bg-[#f4efe9] rounded-xl mb-5">
                <span className="text-sm font-bold text-[#2d242f]">
                  {isAr ? "الإجمالي" : "Total"}
                </span>
                <span className="text-sm font-bold text-[#2d242f]">
                  {totalPrice} {isAr ? "ريال" : "SAR"}
                </span>
              </div>

              {/* Desktop Book Now Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-xl text-center font-bold text-base text-black bg-[#ffc54b] hover:bg-[#c7972f] shadow-sm transition-all cursor-pointer"
              >
                {isAr ? "احجز الان" : "Book Now"}
              </button>
            </div>

            {/* Card 3: Terms & Conditions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#eae3db]">
              <button
                type="button"
                onClick={() => setIsTermsOpen(!isTermsOpen)}
                className="w-full flex items-center justify-between text-start cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#2d242f]">▼</span>
                  <h3 className="text-lg xl:text-xl font-bold text-[#2d242f]">
                    {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
                  </h3>
                </div>
              </button>
              {isTermsOpen ? (
                <>
                  <hr className="border-t border-[#eae3db] my-3" />
                  <div className="pt-1 text-xs xl:text-sm text-[#555] leading-relaxed text-start">
                    <ul className="list-disc list-inside space-y-2">
                      {termsList.map((term, index) => (
                        <li key={index}>{renderTermWithPhone(term)}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Sidebar Column (4 cols on Desktop): Prices & Location */}
          <div className="col-span-4 flex flex-col gap-6">
            {/* Prices Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#eae3db] text-start">
              <h3 className="text-lg font-bold text-[#2d242f] pb-2">
                {isAr ? "الاسعار" : "Prices"}
              </h3>
              <hr className="border-t border-[#eae3db] my-2" />
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-[#666]">
                  {isAr ? "الحد الأدنى" : "Minimum Charge"}
                </span>
                <span
                  className="font-bold text-[#2d242f] text-end"
                  dangerouslySetInnerHTML={{
                    __html: isAr
                      ? localized.priceText
                      : restaurant.en.priceText,
                  }}
                />
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-[#eae3db] text-start">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-lg font-bold text-[#2d242f]">
                  {isAr ? "الموقع" : "Location"}
                </h3>
                <a
                  href={restaurant.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#146394] hover:underline"
                >
                  {isAr ? "الذهاب للموقع" : "Open in Maps"}
                </a>
              </div>
              <hr className="border-t border-[#eae3db] my-2" />
              <div className="mt-2 w-full h-[320px] rounded-xl overflow-hidden bg-gray-100">
                <iframe
                  src={restaurant.mapIframe}
                  title="Location Map"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE LAYOUT (Image 1): Stacked sequence matching the screenshot */}
        <div className="lg:hidden flex flex-col gap-4">
          {/* Card 1: Reservation ("الحجز") */}
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-[#eae3db]">
            <h2 className="text-base font-bold text-[#2d242f] text-center pb-2">
              {isAr ? "الحجز" : "Reservation"}
            </h2>
            <hr className="border-t border-[#eae3db] my-2" />

            {/* Inclusions */}
            <div className="text-start text-xs text-[#444] mb-4">
              <p className="font-bold text-[#2d242f] mb-1.5">
                {isAr ? "الحجز يشمل" : "Reservation includes"}
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#555]">
                <li>
                  {isAr
                    ? "الدخول لمنطقة مطل البجيري التي تعد أفضل وجهة تضم عدد من أرقى المطاعم العالمية والمحلية."
                    : "Access to Bujairi Terrace premier world-class dining."}
                </li>
                <li>
                  {isAr
                    ? "إمكانية الدخول لحي الطريف التاريخي، مع خيار حجز جولة بصحبة مرشد سياحي للتعرف على المنطقة."
                    : "Access to historic At-Turaif district."}
                </li>
                <li>
                  {isAr
                    ? "استرداد قيمة رسوم الحجز من مبلغ الفاتورة."
                    : "Redemption of the booking fee against your restaurant bill."}
                </li>
              </ul>
            </div>

            {/* Guest Counter Row */}
            <div className="flex items-center justify-between py-2 border-t border-[#f2ede7]">
              <span className="text-xs text-[#333] font-medium">
                {isAr ? "عدد الضيوف" : "Guests"} ({restaurant.minGuests} -{" "}
                {restaurant.maxGuests})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#333]">
                  {totalPrice} {isAr ? "ريال" : "SAR"}
                </span>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={guests <= restaurant.minGuests}
                    className="w-7 h-7 rounded-full border border-[#d9d0c7] bg-white flex items-center justify-center font-bold text-sm hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-xs text-[#2d242f]">
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={guests >= restaurant.maxGuests}
                    className="w-7 h-7 rounded-full border border-[#d9d0c7] bg-white flex items-center justify-center font-bold text-sm hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Date Selector */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#444] mb-1.5 text-start">
                {isAr ? "اختار التاريخ" : "Select Date"}
              </label>
              <select
                value={selectedDate || restaurant.dates?.[0]?.value}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white border border-[#d9d0c7] rounded-xl px-3 py-2 text-xs font-medium text-[#2d242f] focus:outline-none focus:border-[#4a374b] cursor-pointer"
              >
                {restaurant.dates?.map((d) => (
                  <option key={d.value} value={d.value}>
                    {isAr ? d.labelAr : d.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selector */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#444] mb-1.5 text-start">
                {isAr ? "اختار الوقت" : "Select Time"}
              </label>
              {restaurant.times && restaurant.times.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {restaurant.times.map((t) => {
                    const active = selectedTime === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTime(t.id)}
                        className={`w-[60px] h-[52px] rounded-xl flex flex-col items-center justify-center shrink-0 border transition-all cursor-pointer ${
                          active
                            ? "bg-[#3d2b3f] text-white border-[#3d2b3f] shadow-xs"
                            : "bg-white text-[#3d2b3f] border-[#d9d0c7] hover:bg-[#faf6f2]"
                        }`}
                      >
                        <span className="text-[11px] font-semibold leading-tight">
                          {t.timeNum}
                        </span>
                        <span className="text-[10px] font-medium leading-tight">
                          {isAr ? t.ampmAr : t.ampmEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#e8f3fb] text-[#146394] p-2.5 rounded-xl text-xs text-center font-medium">
                  {isAr ? "لا توجد أوقات متاحة" : "No times available"}
                </div>
              )}
            </div>

            {/* Total Row */}
            <div className="flex items-center justify-between p-3 bg-[#f4efe9] rounded-xl mt-4">
              <span className="text-xs font-bold text-[#2d242f]">
                {isAr ? "الإجمالي" : "Total"}
              </span>
              <span className="text-xs font-bold text-[#2d242f]">
                {totalPrice} {isAr ? "ريال" : "SAR"}
              </span>
            </div>
          </div>

          {/* Card 2: Location ("الموقع") */}
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-[#eae3db] text-start">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-[#2d242f]">
                {isAr ? "الموقع" : "Location"}
              </h3>
              <a
                href={restaurant.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#146394] hover:underline"
              >
                {isAr ? "الذهاب للموقع" : "Open in Maps"}
              </a>
            </div>
            <hr className="border-t border-[#eae3db] my-2" />
            <div className="mt-2 w-full h-[220px] rounded-xl overflow-hidden bg-gray-100">
              <iframe
                src={restaurant.mapIframe}
                title="Location Map"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Card 3: Terms & Conditions */}
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-[#eae3db]">
            <button
              type="button"
              onClick={() => setIsTermsOpen(!isTermsOpen)}
              className="w-full flex items-center justify-between text-start cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#2d242f]">▼</span>
                <h3 className="text-sm font-bold text-[#2d242f]">
                  {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
                </h3>
              </div>
            </button>
            {isTermsOpen ? (
              <>
                <hr className="border-t border-[#eae3db] my-2" />
                <div className="pt-1 text-xs text-[#555] leading-relaxed text-start">
                  <ul className="list-disc list-inside space-y-1.5">
                    {termsList.map((term, index) => (
                      <li key={index}>{renderTermWithPhone(term)}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Sticky Bar with "احجز الان" button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2d7cc] p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full py-3.5 rounded-xl text-center font-bold text-base text-black bg-[#ffc54b] hover:bg-[#c7972f] shadow-sm transition-all cursor-pointer"
        >
          {isAr ? "احجز الان" : "Book Now"}
        </button>
      </div>

      {/* Mobile bottom padding spacer so content isn't obscured by fixed bar */}
      <div className="lg:hidden h-20" />

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
};

export default RestaurantDetails;
