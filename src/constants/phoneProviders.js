/** Mobile operators — `name` stays Arabic for API payloads */
export const phoneProviders = [
  {
    name: "اس تي سي",
    nameKey: "phone.providers.stc",
    img: "/stc.png",
  },
  {
    name: "اس تي سي جوي",
    nameKey: "phone.providers.stcSaudi",
    img: "/stcgaw.png",
  },
  {
    name: "موبايلي",
    nameKey: "phone.providers.mobily",
    img: "/mobily_2.png",
  },
  {
    name: "زين",
    nameKey: "phone.providers.zain",
    img: "/zain.png",
  },
  {
    name: "فيرجن",
    nameKey: "phone.providers.virgin",
    img: "/virgin.png",
  },
  {
    name: "ليبارا",
    nameKey: "phone.providers.lebara",
    img: "/lebra.png",
  },
  {
    name: "ياقوت",
    nameKey: "phone.providers.yaqoot",
    img: "/yaqoot.png",
  },
];

export const isStcNetwork = (n) =>
  n === "اس تي سي" || n === "اس تي سي جوي" || n === "STC";
export const isMobilyNetwork = (n) => n === "موبايلي" || n === "Mobily";
