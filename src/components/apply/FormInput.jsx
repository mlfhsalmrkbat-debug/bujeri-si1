const inputClass =
  "w-full border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#146394] placeholder:text-gray-400 font-bold";

const FormInput = ({
  label,
  value,
  onChange,
  required = false,
  maxLength,
  minLength,
  inputMode,
  dir = "ltr",
  placeholder,
  numeric = false,
  info,
  infoLabel,
  type = "text",
  rounded = "full",
  disabled = false,
  error,
  normalizeDigits = false,
}) => {
  const invalid = Boolean(error);
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm font-bold text-[#146394]">
      <span>{label}</span>
      <div className="relative">
        <input
          required={required}
          type={type}
          dir={dir}
          inputMode={inputMode}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder || label}
          aria-invalid={invalid}
          className={`${inputClass} ${rounded === "xl" ? "rounded-xl" : "rounded-full"} ${dir === "ltr" ? "text-right" : "text-left"} ${disabled ? "bg-[#203fed17]! cursor-not-allowed" : ""} ${invalid ? "border-red-500 focus:border-red-500" : ""}`}
          value={value}
          onChange={(e) => {
            let next = e.target.value;
            if (normalizeDigits || numeric) {
              next = next
                .replace(/[\u0660-\u0669]/g, (d) =>
                  String(d.charCodeAt(0) - 0x0660),
                )
                .replace(/[\u06f0-\u06f9]/g, (d) =>
                  String(d.charCodeAt(0) - 0x06f0),
                );
            }
            if (numeric && !/^\d*$/.test(next)) return;
            onChange(next);
          }}
          onInvalid={(e) => {
            if (error) e.target.setCustomValidity(error);
          }}
          onInput={(e) => e.target.setCustomValidity("")}
        />
        {info ? (
          <span
            className="absolute inset-y-0 end-3 flex items-center text-[#146394]"
            title={infoLabel || info}
            aria-label={infoLabel || info}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v6M12 8h.01" strokeLinecap="round" />
            </svg>
          </span>
        ) : null}
      </div>
      {error ? (
        <span className="text-xs font-bold text-red-500" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
};

export default FormInput;
export { inputClass };
