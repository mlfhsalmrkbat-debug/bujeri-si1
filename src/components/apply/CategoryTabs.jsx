import {
  LuCar,
  LuHeartPulse,
  LuHeart,
  LuStethoscope,
  LuPlane,
  LuHouse,
} from "react-icons/lu";
import { CiWavePulse1 } from "react-icons/ci";

const TABS = [
  { key: "vehicles", Icon: LuCar, active: true },
  { key: "medical", Icon: LuHeartPulse, active: false },
  { key: "medicalErrors", Icon: LuStethoscope, active: false },
  { key: "travel", Icon: LuPlane, active: false },
  { key: "health", Icon: CiWavePulse1, active: false },
  { key: "domesticWorkers", Icon: LuHouse, active: false },
];

const CategoryTabs = ({ t }) => {
  return (
    <div className="w-[92%] -mt-10  rounded-2xl bg-white shadow-md">
      <ul className="flex min-w-max list-none items-stretch justify-center px-1">
        {TABS.map(({ key, Icon, active }) => (
          <li
            key={key}
            className={`flex  flex-1 flex-col items-center justify-center gap-1 py-2.5 ${
              active
                ? "border-b-[3px] border-[#F5A623] text-[#e6185c]"
                : "border-b-[3px] border-transparent text-gray-400"
            } `}
          >
            
            <Icon
              className={`h-6 w-6  ${active ? "text-[#e6185c]" : "text-[#146394]"} ${key === "health" ? "rotate-180" : ""}`}
              strokeWidth={1.6}
              aria-hidden
            />
            <span className="whitespace-nowrap text-xs font-semibold">
              {t(key === "health" ? "apply.medical" : `apply.${key}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryTabs;
