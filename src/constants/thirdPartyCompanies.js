/** Third-party (ضد الغير) offers — `name`/`label` stay Arabic for API payloads */

const opt = (label, labelKey, price, checked = false) => ({
  label,
  labelKey,
  price,
  checked,
});

const fee = (labelKey, amount) => ({ labelKey, amount });

const SVG = "/sponsors/insurerlogos/svg";

export const thirdPartyCompanies = [
  {
    name: "شركة ولاء للتأمين التعاوني",
    nameKey: "insurance.companies.walaa",
    logo: `${SVG}/Walaa.svg`,
    price: 169.2,
    options: [
      opt("مساعدة على الطريق", "insurance.options.roadside", 50),
      opt("تغطية الحوادث الشخصية للسائق", "insurance.options.driverPersonal", 20),
    ],
    fees: [
      fee("activate.fees.ncd", 85.07),
      fee("activate.fees.vat", 85.07),
    ],
  },
  {
    name: "التعاونية",
    nameKey: "insurance.companies.altawneih",
    logo: `${SVG}/Tawuniya.svg`,
    price: 379.40,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 60),
      opt(
        "تغطية الحوادث الشخصية للسائق والركاب",
        "insurance.options.driverPassengerCombined",
        360
      ),
      opt(
        "المساعدة على الطريق + Drive free",
        "insurance.options.roadsideDriveFree",
        99
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 70),
      fee("activate.fees.vat", 108.75),
      fee("activate.fees.extraLoading", 100),
    ],
  },
  {
    name: "سلامة للتأمين",
    nameKey: "insurance.companies.salamah",
    logo: `${SVG}/Salama.svg`,
    price: 865.25,
    options: [],
    fees: [
      fee("activate.fees.ncd", 73.34),
      fee("activate.fees.vat", 100.99),
      fee("activate.fees.broker", 13.2),
    ],
  },
  {
    name: "ليڤا للتأمين",
    nameKey: "insurance.companies.liva",
    logo: "/liva.jpg",
    price: 735.45,
    options: [],
    fees: [
      fee("activate.fees.ncd", 90),
      fee("activate.fees.vat", 121.8),
    ],
  },
  {
    name: "الاتحاد الخليجي للتأمين التعاوني",
    nameKey: "insurance.companies.gulfUnion",
    logo: `${SVG}/GulfUnion.svg`,
    price: 849.85,
    options: [],
    fees: [
      fee("activate.fees.ncd", 96.15),
      fee("activate.fees.vat", 138),
      fee("activate.fees.admin", 54),
    ],
  },
  {
    name: "شركة التحاد للتأمين",
    nameKey: "insurance.companies.aletihad",
    logo: "/aletihad.png",
    price: 820.15,
    options: [
      opt("تغطية الحوادث الشخصية للسائق", "insurance.options.driverPersonal", 50),
    ],
    fees: [
      fee("activate.fees.ncd", 99.53),
      fee("activate.fees.vat", 134.36),
    ],
  },
  {
    name: "المجموعة المتحدة للتأمين التعاوني",
    nameKey: "insurance.companies.acig",
    logo: "/acig.png",
    price: 955.61,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 60),
      opt(
        "تغطية الحوادث الشخصية للسائق والركاب",
        "insurance.options.driverPassengerCombined",
        360
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 106.41),
      fee("activate.fees.vat", 119.71),
      fee("activate.fees.special", 159.62),
    ],
  },
  {
    name: "المتحدة للتامين التعاوني",
    nameKey: "insurance.companies.almutahida",
    logo: "/almutahida.webp",
    price: 825.81,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 40),
      opt("مساعدة على الطريق", "insurance.options.roadside", 0),
      opt(
        "مساعدة على الطريق البلاتيني",
        "insurance.options.platinumRoadside",
        150
      ),
    ],
    fees: [
      fee("activate.fees.vat", 123.98),
      fee("activate.fees.expo2030", 96.28),
    ],
  },
  {
    name: "بروج للتأمين التعاوني",
    nameKey: "insurance.companies.buruj",
    logo: "/buruj.png",
    price: 915.93,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 70),
      opt(
        "تغطية الحوادث الشخصية للركاب فقط",
        "insurance.options.passengersOnly",
        490
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 107.92),
      fee("activate.fees.vat", 145.96),
    ],
  },
  {
    name: "جي.آي.جي",
    nameKey: "insurance.companies.gig",
    logo: `${SVG}/AXA.svg`,
    price: 1035.15,
    options: [
      opt("الاصابة الجسدية للغير", "insurance.options.tpBodily", 0),
      opt("تلف ممتلكات الغير", "insurance.options.tpProperty", 0),
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 50),
      opt(
        "تغطية الحوادث الشخصية للركاب فقط",
        "insurance.options.passengersOnly",
        280
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 124.1),
      fee("activate.fees.vat", 167.54),
    ],
  },
  {
    name: "التأمين العربي التعاوني",
    nameKey: "insurance.companies.alarabia",
    logo: "/alarabia.webp",
    price: 815.91,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 50),
      opt(
        "تغطية الحوادث الشخصية للركاب فقط",
        "insurance.options.passengersOnly",
        350
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 121.74),
      fee("activate.fees.vat", 174.1),
    ],
  },
  {
    name: "الصقر للتأمين",
    nameKey: "insurance.companies.alsagr",
    logo: `${SVG}/Sagr.svg`,
    price: 1120.61,
    options: [],
    fees: [
      fee("activate.fees.ncd", 133.3),
      fee("activate.fees.vat", 179.96),
    ],
  },
  {
    name: "شركة الدرع العربي",
    nameKey: "insurance.companies.aldera",
    logo: "/aldera alarabi.webp",
    price: 1310.4,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 60),
      opt("مساعدة على الطريق", "insurance.options.roadside", 25),
      opt(
        "تغطية الحوادث الشخصية للركاب فقط",
        "insurance.options.passengersOnly",
        350
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 150),
      fee("activate.fees.vat", 202.5),
    ],
  },
  {
    name: "شركة اليانز للتأمين",
    nameKey: "insurance.companies.allianz",
    logo: `${SVG}/Allianz.svg`,
    price: 1265.91,
    options: [],
    fees: [
      fee("activate.fees.ncd", 160.22),
      fee("activate.fees.vat", 216.29),
    ],
  },
  {
    name: "الخليجية العامة للتأمين",
    nameKey: "insurance.companies.gulf",
    logo: "/gulf.webp",
    price: 1455.13,
    options: [
      opt("تغطية الحوادث الشخصية للسائق فقط", "insurance.options.driverOnly", 40),
      opt(
        "تغطية الحوادث الشخصية للسائق والركاب",
        "insurance.options.driverPassengerCombined",
        220
      ),
      opt("مساعدة على الطريق", "insurance.options.roadside", 35),
    ],
    fees: [
      fee("activate.fees.ncd", 177.85),
      fee("activate.fees.vat", 240.1),
    ],
  },
  {
    name: "شركة أمانة للتأمين التعاوني",
    nameKey: "insurance.companies.amana",
    logo: `${SVG}/Amana.svg`,
    price: 1895.51,
    options: [
      opt(
        "الوفاة والإصابة الجسدية والمصاريف الطبية للمؤمن له أو السائق المسمى",
        "insurance.options.namedInsuredDeathMedical",
        50
      ),
      opt(
        "تغطية الحوادث الشخصية للركاب فقط",
        "insurance.options.passengersOnly",
        350
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 298.81),
      fee("activate.fees.vat", 403.4),
    ],
  },
  {
    name: "ميدغلف السعودية",
    nameKey: "insurance.companies.medgulf",
    logo: "/medgulf.png",
    price: 700.32,
    options: [],
    fees: [
      fee("activate.fees.ncd", 91.8),
      fee("activate.fees.vat", 123.92),
    ],
  },
  {
    name: "تكافل الراجحي",
    nameKey: "insurance.companies.alRajhi",
    logo: `${SVG}/AlRajhi.svg`,
    price: 674.82,
    options: [
      opt(
        "تغطية الحوادث الشخصية للسائق والركاب",
        "insurance.options.driverPassengerCombined",
        50
      ),
      opt("مساعدة على الطريق", "insurance.options.roadside", 30),
      opt(
        "تغطية ضد كسر الزجاج والحرائق والسرقة",
        "insurance.options.glassFireTheft",
        150
      ),
      opt("تغطية الكوارث الطبيعية", "insurance.options.naturalDisasters", 100),
    ],
    fees: [
      fee("activate.fees.ncd", 52.15),
      fee("activate.fees.vat", 70.4),
    ],
  },
  {
    name: "متكاملة للتأمين",
    nameKey: "insurance.companies.motakamlh",
    logo: "/motakamlh.jpg",
    price: 900,
    options: [
      opt(
        "الوفاة والإصابة الجسدية والمصاريف الطبية للسائق",
        "insurance.options.driverDeathMedical",
        30
      ),
    ],
    fees: [
      fee("activate.fees.ncd", 90),
      fee("activate.fees.vat", 117.39),
    ],
  },
  {
    name: "الجزيره التكافل التعاوني",
    nameKey: "insurance.companies.aljazira",
    logo: `${SVG}/Aljazira-Takaful.svg`,
    price: 520,
    options: [],
    fees: [
      fee("activate.fees.ncd", 52),
      fee("activate.fees.vat", 67.83),
    ],
  },
  {
    name: "شركة الوطنية للتأمين",
    nameKey: "insurance.companies.alwataneh",
    logo: `${SVG}/Wataniya.svg`,
    price: 800,
    options: [],
    fees: [
      fee("activate.fees.ncd", 80),
      fee("activate.fees.vat", 104.35),
    ],
  },
];
