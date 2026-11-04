const TypeToggle = ({ value, onChange, newLabel, transferLabel }) => {
  const options = [
    { id: "تأمين جديد", label: newLabel },
    { id: "نقل الملكية", label: transferLabel },
  ];

  return (
    <div className="flex w-full gap-2">
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors ${
              active
                ? "bg-[#146394] text-white"
                : "bg-gray-100 text-[#146394]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TypeToggle;
