import React from "react";

const ProcessingWaitModal = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-white"
      style={{
        direction: "ltr",
        textAlign: "left",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes redirectRaySpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Top Left Redirect Text */}
      <div className="p-4 sm:p-5 text-[13px] sm:text-[14px] leading-normal text-black select-none">
        You are being redirected. If this doesn't happen, please{" "}
        <a
          href="#continue"
          onClick={(e) => e.preventDefault()}
          className="text-[#0000ee] underline hover:text-[#0000aa] cursor-pointer"
        >
          Click here to continue
        </a>
      </div>

      {/* Centered 12-Spoke Radial Spinner */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <svg
          className="w-9 h-9"
          style={{ animation: "redirectRaySpin 1s steps(12, end) infinite" }}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const opacity = Math.max(0.08, 1 - i / 12).toFixed(2);
            return (
              <line
                key={i}
                x1="18"
                y1="4.5"
                x2="18"
                y2="10"
                stroke="#111111"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeOpacity={opacity}
                transform={`rotate(${angle} 18 18)`}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ProcessingWaitModal;
