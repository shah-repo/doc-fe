import React from "react";
import { FBEBPartProps } from "./FBEBPart.types";

export const withFBEBPart = <T extends FBEBPartProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = (props) => Component({
    ...props,
  });
  Comp.displayName = "withFBEBPart";
  return Comp;
};
