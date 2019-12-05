import React from "react";
import FBStore from "../../stores/ui/FBStore";
import { FBCheckContextProps } from "../../types/common/checkcontext";

export const withCheckContext = <T extends FBCheckContextProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    includeContext,
    showContext,
    value,
    type,
    ...props
  }: T) => {

    !showContext &&
      (showContext =
        (FBStore.mode === "form" && (value as boolean) && includeContext) ||
        FBStore.mode === "preview");

    return Component({
      ...(props as T),
      showContext,
      value,
    });
  };
};
