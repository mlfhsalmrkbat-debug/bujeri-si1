const RegistrationToggle = ({ value, onChange, formLabel, customsLabel }) => {
  const options = [
    { id: "أستمارة", label: formLabel },
    { id: "بطاقة جمركية", label: customsLabel },
  ];

  return (
    <div className="flex w-full overflow-hidden rounded-full ">
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex-1 flex items-center justify-center  gap-x-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${
              active ? "bg-[#146394] text-white" : "bg-gray-100 text-[#146394]"
            }`}
          >
            {option.label}
            <span
              className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                active
                  ? "border-white bg-[#F5A623]"
                  : "border-[#146394] bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RegistrationToggle;
