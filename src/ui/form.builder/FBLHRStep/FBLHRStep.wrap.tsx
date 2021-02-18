import React from "react";
import { FBLHRStepProps } from "..";

export const withFBLHRStep = <T extends FBLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name,
    ...props
  }: T) => Component({
    ...(props as T),
    name,
  });

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
