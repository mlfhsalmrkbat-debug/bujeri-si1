const STEPS = [
  { n: 1, key: "reg.stepMain" },
  { n: 2, key: "reg.stepDetails" },
  { n: 3, key: "reg.stepOffers" },
  { n: 4, key: "reg.stepSummary" },
];

const ProgressStepper = ({ t, current = 2 }) => {
  return (
    <ol className="flex w-full items-start justify-between gap-1 px-1">
      {STEPS.map((step, index) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <li key={step.n} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {index > 0 ? (
                <span className="h-px flex-1 bg-gray-300" />
              ) : (
                <span className="flex-1" />
              )}
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  done
                    ? "bg-[#F5A623]"
                    : active
                      ? "bg-[#146394]"
                      : "bg-gray-300"
                }`}
              >
                {step.n}
              </span>
              {index < STEPS.length - 1 ? (
                <span className="h-px flex-1 bg-gray-300" />
              ) : (
                <span className="flex-1" />
              )}
            </div>
            <span
              className={`mt-2 text-center text-[10px] font-bold leading-tight sm:text-xs ${
                done
                  ? "text-[#F5A623]"
                  : active
                    ? "text-[#146394]"
                    : "text-gray-400"
              }`}
            >
              {t(step.key)}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default ProgressStepper;
