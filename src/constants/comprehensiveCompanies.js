/** Comprehensive (شامل) offers — `name`/`label` stay Arabic for API payloads */

const opt = (label, labelKey, price, checked = false) => ({
  label,
  labelKey,
  price,
  checked,
});

const fee = (labelKey, amount) => ({ labelKey, amount });

const SVG = "/sponsors/insurerlogos/svg";
const TOTAL_PARTIAL = "activateShamel.totalPartialLoss";

export const comprehensiveCompanies = [
  {
    name: "تكافل الراجحي",
    nameKey: "insurance.companies.alRajhi",
    logo: `${SVG}/AlRajhi.svg`,
    price: 1132.83,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("مسؤولية الطرف الثالث", "insurance.options.thirdPartyLiability", 0),
      opt(
        "إعفاء من نسبة استهلاك قطع الغيار",
        "insurance.options.sparePartsExemption",
        0
      ),
      opt("تكاليف حالات الطوارئ الطبية", "insurance.options.medicalEmergency", 0),
      opt(
        "تغطية ضد كسر الزجاج والحرائق والسرقة",
        "insurance.options.glassFireTheft",
        150
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 212.41),
      fee("activate.fees.vat", 180.54),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "شركة أمانة للتأمين التعاوني",
    nameKey: "insurance.companies.amana",
    logo: `${SVG}/Amana.svg`,
    price: 1992.42,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt(
        "تغطية الحوادث الشخصية للركاب فقط",
        "insurance.options.passengersOnly",
        350
      ),
      opt("مساعدة على الطريق", "insurance.options.roadside", 0),
      opt(
        "الوفاة والإصابة الجسدية والمصاريف الطبية للمؤمن له أو السائق المسمى",
        "insurance.options.namedInsuredDeathMedical",
        50
      ),
      opt(
        "ايجار المركبة البديلة بحد يومي 100 ريال لمدة 10 ايام",
        "insurance.options.replacementCar10Days",
        300
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 373.58),
      fee("activate.fees.vat", 317.54),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "سلامة للتأمين",
    nameKey: "insurance.companies.salamah",
    logo: `${SVG}/Salama.svg`,
    price: 2830.12,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("سيارة بديلة", "insurance.options.replacementCar", 575),
      opt("مساعدة على الطريق", "insurance.options.roadside", 345),
      opt(
        "الوفاة والإصابة الجسدية والمصاريف الطبية للمؤمن له أو السائق المسمى",
        "insurance.options.namedInsuredDeathMedical",
        920
      ),
      opt(
        "الحوادث التي تقع خارج الحدود الاقليمية للمملكة العربية السعودية",
        "insurance.options.accidentsOutsideKsa",
        920
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 530.65),
      fee("activate.fees.vat", 518.71),
      fee("activate.fees.brokerEnaya", 451.05),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "جي.آي.جي",
    nameKey: "insurance.companies.gig",
    logo: `${SVG}/AXA.svg`,
    price: 3134.81,
    defaultCoverageKey: "activateShamel.vehicleLossDamage",
    options: [
      opt("الاصابة الجسدية للغير", "insurance.options.tpBodily", 0),
      opt("تلف ممتلكات الغير", "insurance.options.tpProperty", 0),
      opt(
        "تغطية مجانية للتكاليف الطبية الطارئة لحد 5000 ريال لكل شخص",
        "insurance.options.freeEmergencyMedical5000",
        0
      ),
      opt("الاخطار الطبيعية", "insurance.options.naturalHazards", 0),
    ],
    fees: [
      fee("activate.fees.ncd", 500),
      fee("activate.fees.vat", 409.15),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "شركة ولاء للتأمين التعاوني",
    nameKey: "insurance.companies.walaa",
    logo: `${SVG}/Walaa.svg`,
    price: 2400,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 50),
      opt(
        "تغطية الحوادث الشخصية للركاب فقط",
        "insurance.options.passengersOnly",
        280
      ),
      opt("سيارة بديلة", "insurance.options.replacementCar", 450),
      opt("مساعدة على الطريق", "insurance.options.roadside", 50),
    ],
    fees: [
      fee("activate.fees.ncd", 450),
      fee("activate.fees.vat", 382.5),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "بروج للتأمين التعاوني",
    nameKey: "insurance.companies.buruj",
    logo: "/buruj.png",
    price: 2524.31,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt(
        "استئجار سيارة بحد أقصى 2,000 ريال لكل مركبة، بحد أقصى 100 ريال في اليوم، وبمدة لا تتجاوز 20 يوم",
        "insurance.options.rentalCar20Days",
        600
      ),
      opt(
        "استئجار سيارة بديلة بحد أعلى",
        "insurance.options.rentalCarHigh",
        1500
      ),
      opt(
        "استئجار سيارة بديلة بحد متوسط",
        "insurance.options.rentalCarMid",
        1200
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 430),
      fee("activate.fees.vat", 365),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "شركة الوطنية للتأمين",
    nameKey: "insurance.companies.alwataneh",
    logo: `${SVG}/Wataniya.svg`,
    price: 4665.22,
    defaultCoverageKey: "activate.civilLiabilityFull",
    options: [
      opt(
        "تغطية الخسارة الكلية أو الجزئية للمركبة",
        "activateShamel.totalPartialLoss",
        0
      ),
      opt("تغطية السرقة والحرائق", "insurance.options.theftFire", 0),
      opt("الأخطار الطبيعية", "insurance.options.naturalHazards", 0),
      opt("مصاريف السحب", "insurance.options.towing", 0),
    ],
    fees: [
      fee("activate.fees.ncd", 706.05),
      fee("activate.fees.vat", 600.14),
      fee("activate.fees.bcare", 230.05),
    ],
  },
  {
    name: "التأمين العربي التعاوني",
    nameKey: "insurance.companies.alarabia",
    logo: "/alarabia.webp",
    price: 5102.83,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 50),
      opt(
        "تغطية الحوادث الشخصية للركاب فقط",
        "insurance.options.passengersOnly",
        280
      ),
      opt("تغطية دول مجلس التعاون الخليجي", "insurance.options.gcc", 500),
      opt("سيارة بديلة", "insurance.options.replacementCar", 250),
    ],
    fees: [
      fee("activate.fees.ncd", 1014.16),
      fee("activate.fees.vat", 874.34),
      fee("activate.fees.bcare", 335.16),
    ],
  },
  {
    name: "شركة الدرع العربي",
    nameKey: "insurance.companies.aldera",
    logo: "/aldera alarabi.webp",
    price: 2588,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("الأخطار الطبيعية", "insurance.options.naturalHazards", 0),
      opt("ضرر كامل", "insurance.options.totalDamage", 0),
      opt(
        "تغطية ضد كسر الزجاج والحرائق والسرقة",
        "insurance.options.glassFireTheft",
        0
      ),
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 60),
    ],
    fees: [
      fee("activate.fees.ncd", 485.25),
      fee("activate.fees.vat", 412.46),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "الخليجية العامة للتأمين",
    nameKey: "insurance.companies.gulf",
    logo: "/gulf.webp",
    price: 2035.34,
    defaultCoverageKey: "activateShamel.tpBodilyDefault",
    options: [
      opt("الأخطار الطبيعية", "insurance.options.naturalHazards", 0),
      opt("مساعدة على الطريق", "insurance.options.roadside", 0),
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 40),
    ],
    fees: [
      fee("activate.fees.ncd", 381.63),
      fee("activate.fees.vat", 324.38),
    ],
  },
  {
    name: "التعاونية",
    nameKey: "insurance.companies.altawneih",
    logo: `${SVG}/Tawuniya.svg`,
    price: 1600,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("تغطية الإصلاح في الوكالة", "insurance.options.agencyRepair", 300),
      opt(
        "تغطية الحوادث الشخصية الشاملة",
        "insurance.options.comprehensivePersonal",
        180
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 240),
      fee("activate.fees.vat", 208.7),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "ميدغلف السعودية",
    nameKey: "insurance.companies.medgulf",
    logo: "/medgulf.png",
    price: 1500,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("مساعدة على الطريق", "insurance.options.roadside", 30),
      opt("تغطية السرقة والحريق", "insurance.options.theftFire", 180),
    ],
    fees: [
      fee("activate.fees.ncd", 225),
      fee("activate.fees.vat", 195.65),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "متكاملة للتأمين",
    nameKey: "insurance.companies.motakamlh",
    logo: "/motakamlh.jpg",
    price: 1750,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt(
        "الوفاة والإصابة الجسدية والمصاريف الطبية للسائق",
        "insurance.options.driverDeathMedical",
        30
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 262),
      fee("activate.fees.vat", 228.26),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "المجموعة المتحدة للتأمين التعاوني",
    nameKey: "insurance.companies.acig",
    logo: "/acig.png",
    price: 1650,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("تغطية الحوادث الشخصية للسائق", "insurance.options.driverPersonal", 50),
      opt(
        "تغطية الحوادث الشخصية للركاب",
        "insurance.options.passengerPersonal",
        240
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 247),
      fee("activate.fees.vat", 215.22),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "ليڤا للتأمين",
    nameKey: "insurance.companies.liva",
    logo: "/liva.jpg",
    price: 1450,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("تغطية الحوادث الشخصية للسائق", "insurance.options.driverPersonal", 50),
      opt("مساعدة على الطريق", "insurance.options.roadside", 50),
    ],
    fees: [
      fee("activate.fees.ncd", 217),
      fee("activate.fees.vat", 189.13),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "الجزيره التكافل التعاوني",
    nameKey: "insurance.companies.aljazira",
    logo: `${SVG}/Aljazira-Takaful.svg`,
    price: 2250,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt(
        "تغطية الحوادث الشخصية للسائق والركاب",
        "insurance.options.driverPassengerCombined",
        150
      ),
      opt("مساعدة على الطريق", "insurance.options.roadside", 50),
    ],
    fees: [
      fee("activate.fees.ncd", 337),
      fee("activate.fees.vat", 293.48),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "المتحدة للتامين التعاوني",
    nameKey: "insurance.companies.almutahida",
    logo: "/almutahida.webp",
    price: 1300,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("مساعدة على الطريق", "insurance.options.roadside", 0),
      opt(
        "مساعدة على الطريق البلاتيني",
        "insurance.options.platinumRoadside",
        150
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 195),
      fee("activate.fees.vat", 169.57),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "شركة اليانز للتأمين",
    nameKey: "insurance.companies.allianz",
    logo: `${SVG}/Allianz.svg`,
    price: 1700,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 60),
    ],
    fees: [
      fee("activate.fees.ncd", 255),
      fee("activate.fees.vat", 221.74),
      fee("activate.fees.bcare", 200),
    ],
  },
  {
    name: "شركة التحاد للتأمين",
    nameKey: "insurance.companies.aletihad",
    logo: "/aletihad.png",
    price: 1250,
    defaultCoverageKey: TOTAL_PARTIAL,
    options: [
      opt("تغطية الحوادث الشخصية للسائق", "insurance.options.driverPersonal", 50),
    ],
    fees: [
      fee("activate.fees.ncd", 187),
      fee("activate.fees.vat", 163.04),
      fee("activate.fees.bcare", 200),
    ],
  },
];
