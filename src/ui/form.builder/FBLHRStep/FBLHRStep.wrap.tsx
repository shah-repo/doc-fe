import React from "react";
import { FB, FBLHRStepProps } from "..";

export const withFBLHRStep = <T extends FBLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name,
    disabled,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();
    disabled = workspaceState?.mode !== "design";

    return Component({
      ...(props as T),
      name,
      disabled,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
