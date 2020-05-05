import _ from "lodash";
import React from "react";
import { FB, FBMediaQRProps } from "..";
import FBDRStore from "../stores/ui/FBDRStore";
import FBStore from "../stores/ui/FBStore";

export const withFBMediaQR = <T extends FBMediaQRProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    isTemplate,
    mode = "qr",
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();

    switch (true) {
      case isTemplate && workspaceState?.mode === "design":
        _.isEmpty(FBStore.documentId) && (mode = "preupload");
        break;
      case !isTemplate && workspaceState?.mode === "design":
        mode = "placeholder";
        break;
      case !isTemplate && workspaceState?.mode === "form":
        (_.isEmpty(FBStore.documentId) || FBDRStore.mode === "outputCreate") && (mode = "preupload");
        break;
      case !isTemplate && workspaceState?.mode === "preview":
        mode = FBDRStore.isOutput ? "preupload" : "placeholder";
        break;
      default:
        mode = "qr";
    }

    return Component({
      ...(props as T),
      isTemplate,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
