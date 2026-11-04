import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import Footer from "../Footer";

const CheckoutInfo = () => {
  const { language, dir } = useTranslation();
  const isAr = language === "ar";
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    let uData = {};
    try {
      uData = JSON.parse(
        sessionStorage.getItem("userData") ||
          localStorage.getItem("userData") ||
          "{}",
      );
    } catch {}

    return {
      firstName:
        sessionStorage.getItem("firstName") ||
        localStorage.getItem("firstName") ||
        uData.firstName ||
        "",
      lastName:
        sessionStorage.getItem("lastName") ||
        localStorage.getItem("lastName") ||
        uData.lastName ||
        "",
      email:
        sessionStorage.getItem("email") ||
        localStorage.getItem("email") ||
        uData.email ||
        "",
      phone:
        sessionStorage.getItem("phone") ||
        localStorage.getItem("phone") ||
        uData.phone ||
        "",
    };
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = isAr
        ? "الاسم الأول مطلوب"
        : "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = isAr ? "اسم العائلة مطلوب" : "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = isAr ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = isAr
        ? "يرجى كتابة البريد الإلكتروني بشكل صحيح"
        : "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = isAr ? "رقم الجوال مطلوب" : "Phone number is required";
    } else {
      const cleanPhone = formData.phone.replace(/\D/g, "");
      if (cleanPhone.length < 9) {
        newErrors.phone = isAr
          ? "يرجى إدخال رقم جوال صحيح (9 أرقام على الأقل)"
          : "Please enter a valid phone number (at least 9 digits)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fn = formData.firstName.trim();
    const ln = formData.lastName.trim();
    const em = formData.email.trim();
    const ph = formData.phone.trim();

    sessionStorage.setItem("firstName", fn);
    sessionStorage.setItem("lastName", ln);
    sessionStorage.setItem("email", em);
    sessionStorage.setItem("phone", ph);
    sessionStorage.setItem(
      "userData",
      JSON.stringify({
        firstName: fn,
        lastName: ln,
        email: em,
        phone: ph,
        fullName: `${fn} ${ln}`,
      }),
    );

    let isDiriyahTicket = true;
    try {
      const storedCart = sessionStorage.getItem("cartItem");
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (parsed.type === "restaurant" && parsed.restaurantId) {
          isDiriyahTicket = false;
        }
      }
    } catch {}

    if (isDiriyahTicket) {
      navigate(isAr ? "/ar/diriyah-tickets" : "/en/diriyah-tickets");
    } else {
      navigate(isAr ? "/ar/summary" : "/en/summary");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f0eae3] font-['GraphikArabic',sans-serif] text-[#2d242f]"
      dir={dir}
    >
      {/* TicketMX Bujairi Header with Steps */}
      <div className="w-full bg-[#4a374b] py-6 px-4 sm:px-6 lg:px-8 border-b border-[#3b2a3c]">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white order-2 lg:order-1 text-center lg:text-start">
            {isAr ? "تسجيل الدخول" : "Login"}
          </h1>

          {/* Stepper (Step 1 Active) */}
          <div className="w-full lg:w-auto min-w-[280px] sm:min-w-[380px] order-1 lg:order-2">
            <div className="relative flex items-center justify-between">
              {/* Connecting line behind circles */}
              <div className="absolute top-[7px] left-[15%] right-[15%] h-[2px] bg-white/20 z-0" />

              {/* Step 1: Active */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffc54b] ring-4 ring-[#ffc54b]/30 mb-2" />
                <span className="text-xs sm:text-sm font-bold text-[#ffc54b] text-center">
                  {isAr ? "تسجيل دخول" : "Login"}
                </span>
              </div>

              {/* Step 2: Inactive */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-white/40 mb-2" />
                <span className="text-xs sm:text-sm font-medium text-white/60 text-center">
                  {isAr ? "اختيار التذاكر" : "Select Tickets"}
                </span>
              </div>

              {/* Step 3: Inactive */}
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-3.5 h-3.5 rounded-full bg-white/40 mb-2" />
                <span className="text-xs sm:text-sm font-medium text-white/60 text-center">
                  {isAr ? "إتمام الشراء" : "Complete Purchase"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[700px] mx-auto">
          <div className="bg-white rounded-2xl shadow-md border border-[#e5dcd3] overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#4a374b] text-white px-6 py-4 text-center">
              <h2 className="text-xl sm:text-2xl font-bold">
                {isAr ? "إدخال البيانات الشخصية" : "Enter Personal Information"}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                {isAr
                  ? "يرجى تعبئة الحقول التالية للمتابعة إلى صفحة إتمام الحجز"
                  : "Please fill in the following fields to proceed to booking completion"}
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-bold text-[#4a374b] mb-1.5"
                  >
                    {isAr ? "الاسم الأول" : "First Name"}
                    <span className="text-red-500 ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={isAr ? "مثال: محمد" : "e.g. Mohammed"}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all ${
                      errors.firstName
                        ? "border-red-500 ring-2 ring-red-100"
                        : "border-[#dcd3ca] focus:border-[#4a374b] focus:ring-2 focus:ring-[#4a374b]/15"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-bold text-[#4a374b] mb-1.5"
                  >
                    {isAr ? "اسم العائلة" : "Last Name"}
                    <span className="text-red-500 ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={isAr ? "مثال: السالم" : "e.g. Al-Salem"}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all ${
                      errors.lastName
                        ? "border-red-500 ring-2 ring-red-100"
                        : "border-[#dcd3ca] focus:border-[#4a374b] focus:ring-2 focus:ring-[#4a374b]/15"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-[#4a374b] mb-1.5"
                >
                  {isAr ? "البريد الإلكتروني" : "Email Address"}
                  <span className="text-red-500 ms-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all text-start ${
                    errors.email
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-[#dcd3ca] focus:border-[#4a374b] focus:ring-2 focus:ring-[#4a374b]/15"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mobile Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-[#4a374b] mb-1.5"
                >
                  {isAr ? "رقم الجوال" : "Mobile Phone"}
                  <span className="text-red-500 ms-1">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  dir="ltr"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05XXXXXXXX"
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-sm outline-none transition-all text-start ${
                    errors.phone
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-[#dcd3ca] focus:border-[#4a374b] focus:ring-2 focus:ring-[#4a374b]/15"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-center font-bold text-base sm:text-lg text-white bg-[#4a374b] hover:bg-[#372738] active:scale-[0.99] transition-all cursor-pointer shadow-md"
                >
                  {isAr ? "المتابعة لإتمام الحجز" : "Continue to Summary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CheckoutInfo;
