import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

const useEffectInEvent = (
  event: "resize" | "scroll",
  eventHandler: () => void,
  shouldCapture?: boolean,
) => {
  useEffect(() => {
    eventHandler();
    window.addEventListener(event, eventHandler, shouldCapture);
    return () => window.removeEventListener(event, eventHandler, shouldCapture);
  }, [event, eventHandler, shouldCapture]);
};

export const useClientBoundRect = <T extends Element>(): [
  DOMRect | undefined,
  MutableRefObject<T | null>
] => {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<DOMRect>();

  const set = useCallback(
    () => {
      setRect(ref.current?.getBoundingClientRect());
    },
    []
  );

  useEffectInEvent("resize", set);
  useEffectInEvent("scroll", set, true);

  return [rect, ref];
};
