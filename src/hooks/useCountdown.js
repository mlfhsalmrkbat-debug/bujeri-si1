import { useEffect, useState } from "react";

export function useCountdown(initialSeconds) {
  const [counter, setCounter] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return { counter, formattedMinutes, formattedSeconds, setCounter };
}
