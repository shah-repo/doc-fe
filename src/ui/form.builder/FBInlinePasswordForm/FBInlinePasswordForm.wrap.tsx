import React from "react";
import { FB } from "..";

export const withFBInlinePasswordForm = (
  Component: React.FunctionComponent<any>,
) => {
  const Comp = () => {
    const { dialogState } = FB.useStores();
    console.log(dialogState);

    return Component({
      test: "test",
    }); };
  Comp.displayName = "withFBInlinePasswordForm";
  return Comp;
};
