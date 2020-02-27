import _ from "lodash";
import React from "react";
import { FBMediaQRProps } from ".";
import FBStore from "../stores/ui/FBStore";

export const withFBMediaQR = <T extends FBMediaQRProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({ disabled, ...props }: T) => {
    disabled = !(FBStore.mode === "form" && !_.isEmpty(FBStore.docId));

    return Component({
      ...(props as T),
      disabled
    });
  };

  return (props: T) => Comp(props);
};
