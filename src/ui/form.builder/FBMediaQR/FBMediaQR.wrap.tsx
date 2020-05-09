import React from "react";
import { FB, FBMediaQRProps } from "..";
import FBDRStore from "../stores/ui/FBDRStore";

export const withFBMediaQR = <T extends FBMediaQRProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    isTemplate,
    mode = "qr",
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    const { mode: workspaceMode, documentId } = workspaceState || {};

    switch (true) {
      case isTemplate && workspaceMode === "design":
        !documentId && (mode = "preupload");
        break;
      case !isTemplate && workspaceMode === "design":
        mode = "placeholder";
        break;
      case !isTemplate && workspaceMode === "form":
        (!documentId || FBDRStore.mode === "outputCreate") && (mode = "preupload");
        break;
      case !isTemplate && workspaceMode === "preview":
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
