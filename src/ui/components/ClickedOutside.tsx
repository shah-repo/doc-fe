import React, { useRef, useEffect } from "react";

const useOutsideAlerter = (ref: any, onBlur: any) => {

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (onBlur) {
        event.preventDefault();
        onBlur();
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
}

interface OwnProps {
  onBlur: any;
}

type Props = OwnProps;

/**
 * Component that alerts if you click outside of it
 */
const ClickedOutside: React.FunctionComponent<Props> = ({ children, onBlur }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, onBlur);

  return <div ref={wrapperRef}>{children}</div>;
}

export default ClickedOutside;