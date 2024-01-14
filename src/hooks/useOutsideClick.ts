import { useEffect, useRef } from "react";

interface UseOutsideHook {
  close: () => void;
  listenCapturing?: boolean;
}

const useOutsideClick = <T extends HTMLElement | SVGElement>({
  close,
  listenCapturing = true,
}: UseOutsideHook) => {
  const ref = useRef<T>(null!);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [close, listenCapturing]);

  return { ref };
};

export default useOutsideClick;
