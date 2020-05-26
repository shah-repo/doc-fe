import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollIntoView = () => {
  const location = useLocation();
  useEffect(() => {
    const hash = location.hash;
    if (!hash) {
      return;
    }
    const selector = `[id="${hash.substring(1)}"]`;
    const element = document.querySelector(selector) as HTMLElement;
    element && element.scrollIntoView({ behavior: "smooth" });
  }, [location]);
};
