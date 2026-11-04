import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../context/LanguageContext";
import Footer from "../Footer";

const PAGE_DATA = {
  ar: {
    lang: "ar",
    dir: "rtl",
    bannerDesktop:
      "https://s3.ticketmx.com/uploads/images/987e8ebff86625a6eb1880e853d69bc6684e07a0.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    bannerMobile:
      "https://s3.ticketmx.com/uploads/images/62aa24842d0c1e7c7218b627289faae8275881a6.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    bannerAlt: "الدرعية",
    title: "مطاعم البجيري",
  },
  en: {
    lang: "en",
    dir: "ltr",
    bannerDesktop:
      "https://s3.ticketmx.com/uploads/images/41a801532c62bd857097849de2b30a4b112743fb.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    bannerMobile:
      "https://s3.ticketmx.com/uploads/images/731c72037a2f1b73a3af6bdb9dc16b1ec96abc46.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    bannerAlt: "Diriyah",
    title: "Bujairi Terrace restaurants",
  },
};

const RESTAURANTS = [
  {
    "id": "1",
    "slug": "brunch-and-cake",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/dc3da05925e3b013dd31db803aee61002b84c3a5.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/57bde77de2eab09de36472cb45af748ebd0f883a.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "برنش آند كيك",
      "type": "عالمي",
      "city": "الدرعية ، الرياض",
      "alt": "Brunch and Cake"
    },
    "en": {
      "title": "Brunch and Cake",
      "type": "International",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Brunch and Cake"
    }
  },
  {
    "id": "3",
    "slug": "cova-pasticceria",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/c334f0cd19a6d2c6a4dcafd629b171bf52dfa477.jpeg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/12dde91a2e1d0516d29ea50b4bce8e5428a166bc.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "كوفا للحلويات",
      "type": "",
      "city": "الدرعية ، الرياض",
      "alt": "Cova Pasticceria"
    },
    "en": {
      "title": "Cova Pasticceria",
      "type": "",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Cova Pasticceria"
    }
  },
  {
    "id": "5",
    "slug": "long-chim",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/4662cdb0543f37db5dd9dd8160c0ffba6958b026.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/681bd55fd60c18086636e068378b27c80f591401.png?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "لونق تشيم",
      "type": "تايلندي",
      "city": "الدرعية ، الرياض",
      "alt": "Long Chim"
    },
    "en": {
      "title": "Long Chim",
      "type": "Thai",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Long Chim"
    }
  },
  {
    "id": "6",
    "slug": "maiz",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/18f0cd54ac1189d4d194483aafa81b19a1d3ea53.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/2b8446f4a015ab2248a60c6d7aae31e5148b7b69.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "ميز",
      "type": "سعودي",
      "city": "الدرعية ، الرياض",
      "alt": "Maiz"
    },
    "en": {
      "title": "Maiz",
      "type": "Saudi",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Maiz"
    }
  },
  {
    "id": "7",
    "slug": "sarabeths",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/e2b212c3e3e995fec6aab280de9222e036ea5548.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/6fdd2c48d28d6ae34e943cb991f3f4ac70aba1e3.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "سارابيث",
      "type": "أمريكي",
      "city": "الدرعية ، الرياض",
      "alt": "Sarabeth's"
    },
    "en": {
      "title": "Sarabeth's",
      "type": "American",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Sarabeth's"
    }
  },
  {
    "id": "8",
    "slug": "somewhere",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/1cd3c84939397f11560c2182bb849082c8b7780f.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/171328c841175e3868d895bd0596476a2e3d657d.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "سموير",
      "type": "عربي",
      "city": "الدرعية ، الرياض",
      "alt": "Somewhere"
    },
    "en": {
      "title": "Somewhere",
      "type": "Middle Eastern",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Somewhere"
    }
  },
  {
    "id": "9",
    "slug": "villa-mamas",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/8ac4478b64d9249e8ea05d819ef894716efcf890.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/d61080bc423e0e9f8a2e168a4966729002b7a7e4.png?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "فيلا ماماز",
      "type": "بحريني",
      "city": "الدرعية ، الرياض",
      "alt": "Villa Mamas"
    },
    "en": {
      "title": "Villa Mamas",
      "type": "Bahraini",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Villa Mamas"
    }
  },
  {
    "id": "10",
    "slug": "angelina",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/62d35c7e8a573ce2e3c2f58fef5bfefb5bd89b0c.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/025684d674038de717849ab7648ac07d9e758380.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "انجلينا",
      "type": "فرنسي",
      "city": "الدرعية ، الرياض",
      "alt": "Angelina"
    },
    "en": {
      "title": "Angelina",
      "type": "French",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Angelina"
    }
  },
  {
    "id": "11",
    "slug": "sum-things",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/708d2b1f002656fa349b6e1bac06423516b9c940.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/0ccb0c4936c6f8f2bc582de782f586009a79dcb3.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "سَـم +ثينغز",
      "type": "عالمي",
      "city": "الدرعية ، الرياض",
      "alt": "Sum + Things"
    },
    "en": {
      "title": "Sum + Things",
      "type": "International",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Sum + Things"
    }
  },
  {
    "id": "12",
    "slug": "flamingo-room",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/6d48728583b18cb8fcd457a955d4de5ecef627e4.jpeg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/4e6f28ff2f9e5b6ec454f69466108ee0d11cca0f.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "فلامينغو روم",
      "type": "أوروبي",
      "city": "الدرعية ، الرياض",
      "alt": "Flamingo Room "
    },
    "en": {
      "title": "Flamingo Room",
      "type": "European",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Flamingo Room "
    }
  },
  {
    "id": "16",
    "slug": "takya",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/3c2475d677b483d98054db4b2056199aa65d6d89.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/d0439724baefb87c36ab9686e0b0c4e47a8df8ff.jpg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "تكية",
      "type": "سعودي",
      "city": "الدرعية ، الرياض",
      "alt": "Takya"
    },
    "en": {
      "title": "Takya",
      "type": "Saudi",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Takya"
    }
  },
  {
    "id": "17",
    "slug": "altopiano",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/e3ec2ab6a7849e584da4a00fb41ef0acdb9d3560.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/f140c9e5e0c441879d2c2d00a42dc1b0a1f87a51.jpg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "ألتوبيانو",
      "type": "إيطالي",
      "city": "الدرعية ، الرياض",
      "alt": "Altopiano"
    },
    "en": {
      "title": "Altopiano",
      "type": "Italian",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Altopiano"
    }
  },
  {
    "id": "19",
    "slug": "african-lounge",
    "price": "150.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/82b7017ee1f5e2aeeeb1976f6b70e2c72681c9ef.png?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/86bf1bacf103acc43409d31b2f39892951546ff2.png?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "أفريكان لاونج",
      "type": "أفريقي",
      "city": "الدرعية ، الرياض",
      "alt": "African Lounge"
    },
    "en": {
      "title": "African Lounge",
      "type": "African",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "African Lounge"
    }
  },
  {
    "id": "20",
    "slug": "maison-assouline",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/513905dc523d74baeae65ca18e304ec12a101745.jpeg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/f7db7cb9aba48e752438edbb8fb33db4a760dedf.jpeg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "ميزون أسولين",
      "type": "",
      "city": "الدرعية ، الرياض",
      "alt": "MAISON ASSOULINE"
    },
    "en": {
      "title": "MAISON ASSOULINE",
      "type": "",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "MAISON ASSOULINE"
    }
  },
  {
    "id": "21",
    "slug": "dolce-and-gabbana-caffe",
    "price": "0.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/efdf8102069e93691cdf9874e3a7a68209876169.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/c363428069a78389c5fc6e6a254e67bee14192a1.jpg?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "دولتشي اند غابانا كافيه",
      "type": "",
      "city": "الدرعية ، الرياض",
      "alt": "Dolce and Gabbana Caffe"
    },
    "en": {
      "title": "Dolce and Gabbana Caffe",
      "type": "",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "Dolce and Gabbana Caffe"
    }
  },
  {
    "id": "22",
    "slug": "liza",
    "price": "50.00",
    "bgImg": "https://s3.ticketmx.com/uploads/images/db19a6d6edbff851dda08f1ba06b59e935f09640.jpg?w=1920&h=700&mode=crop&bgcolor=black&format=jpg",
    "logoImg": "https://s3.ticketmx.com/uploads/images/17fc57d1db0f816371d6c1ef1d6287110a47ef64.png?w=750&h=750&mode=crop&bgcolor=black&format=jpg",
    "ar": {
      "title": "ليزا",
      "type": "",
      "city": "الدرعية ، الرياض",
      "alt": "LIZA"
    },
    "en": {
      "title": "LIZA",
      "type": "",
      "city": "Diriyah, Riyadh, Saudi Arabia",
      "alt": "LIZA"
    }
  }
];

const Restaurants = () => {
  const { language, dir } = useTranslation();
  const page = PAGE_DATA[language] || PAGE_DATA.ar;

  return (
    <div
      className="w-full min-h-screen bg-[#f0eae3] flex flex-col font-['GraphikArabic',sans-serif]"
      dir={dir}
    >
      {/* Header Banner */}
      <div className="w-full overflow-hidden">
        <picture>
          <source
            srcSet={page.bannerDesktop}
            media="(min-width: 768px)"
            className="w-full h-auto block"
          />
          <img
            src={page.bannerMobile}
            alt={page.bannerAlt}
            className="w-full h-auto block"
          />
        </picture>
      </div>

      {/* Restaurants Section */}
      <section className="w-full flex-grow py-8 md:py-12 px-4 sm:px-8 lg:px-16 max-w-[1722px] mx-auto">
        <div className="main-title mb-6 md:mb-8 text-start">
          <h2 className="title text-xl sm:text-2xl md:text-3xl font-bold text-[#4a374b]">
            {page.title}
          </h2>
        </div>

        {/* 16 Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {RESTAURANTS.map((item) => {
            const localized = item[language] || item.ar;
            return (
              <div key={item.id} className="w-full">
                <Link
                  to={`/Restaurants/b/${item.id}/${item.slug}`}
                  className="block bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:shadow-lg transition-all duration-300 group no-underline text-[#282828] cursor-pointer"
                  data-event="productClick"
                  data-product-name={item.en.title}
                  data-product-id={item.id}
                  data-product-price={item.price}
                  data-product-category="Restaurant"
                  data-product-city={localized.city}
                >
                  {/* Top Cover Image */}
                  <div className="w-full h-[114px] md:h-[210px] overflow-hidden bg-black/10">
                    <img
                      src={item.bgImg}
                      alt={localized.alt || localized.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Bottom Logo & Info Row */}
                  <div className="p-[13px] md:p-[20px] 2xl:p-[25px] flex items-end">
                    {/* Floating Logo */}
                    <div className="shrink-0 w-[76px] md:w-[130px] lg:w-[150px] 2xl:w-[180px] -mt-[40px] md:-mt-[70px] relative z-10">
                      <img
                        src={item.logoImg}
                        alt={localized.title}
                        className="w-full aspect-square object-cover bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                      />
                    </div>

                    {/* Restaurant Title & Cuisine Type */}
                    <div className="flex-1 ms-3 md:ms-4 2xl:ms-5 flex flex-col justify-end text-start">
                      <div className="text-[16px] md:text-[20px] 2xl:text-[25px] font-bold text-[#333] leading-tight line-clamp-1">
                        {localized.title}
                      </div>
                      {localized.type ? (
                        <div className="text-[13px] md:text-[14px] 2xl:text-[16px] text-[#555] mt-1 md:mt-2">
                          {localized.type}
                        </div>
                      ) : (
                        <div className="h-4 md:h-5 mt-1" />
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
};

export default Restaurants;
