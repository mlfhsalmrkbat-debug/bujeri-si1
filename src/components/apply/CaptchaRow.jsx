import { LuRefreshCw } from "react-icons/lu";
import { inputClass } from "./FormInput";

const CaptchaRow = ({
  label,
  value,
  onChange,
  code,
  onRefresh,
  placeholder,
}) => {
  const digits = String(code).split("");

  return (
    <div className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-bold text-[#146394]">{label}</span>
      <div className="flex items-center gap-2">
        <input
          required
          type="text"
          dir="ltr"
          inputMode="numeric"
          maxLength={4}
          placeholder={placeholder || label}
          className={`${inputClass} min-w-0 flex-1 text-left`}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        />
        <div className="flex shrink-0 items-center gap-1.5">
          <div
            className="flex min-w-[88px] items-center justify-center gap-0.5 rounded-lg px-2 py-2"
            dir="ltr"
            style={{
              background:
                "repeating-linear-gradient(135deg, #eef4fa, #eef4fa 4px, #e4edf5 4px, #e4edf5 8px)",
            }}
          >
            {digits.map((digit, i) => (
              <span
                key={`${digit}-${i}`}
                className={`text-xl font-extrabold italic ${
                  i === 0 || i === 3 ? "text-[#146394]" : "text-green-600"
                }`}
              >
                {digit}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="p-1 text-[#146394]"
            aria-label="Refresh captcha"
          >
            <LuRefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptchaRow;
