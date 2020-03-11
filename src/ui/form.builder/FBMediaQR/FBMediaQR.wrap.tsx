import _ from "lodash";
import React from "react";
import { FBMediaQRProps } from ".";
import FBDRStore from "../stores/ui/FBDRStore";
import FBStore from "../stores/ui/FBStore";

export const withFBMediaQR = <T extends FBMediaQRProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    disabled,
    isTemplate,
    mode = "qr",
    ...props
  }: T) => {

    disabled = !(FBStore.mode === "form" && !_.isEmpty(FBStore.docId)) && !isTemplate;

    switch (true) {
      case isTemplate && FBStore.mode === "design":
        _.isEmpty(FBStore.documentId) && (mode = "preupload");
        break;
      case !isTemplate && FBStore.mode === "design":
        mode = "placeholder";
        break;
      case !isTemplate && FBStore.mode === "form":
        (_.isEmpty(FBStore.documentId) || FBDRStore.mode === "outputCreate") && (mode = "preupload");
        break;
      case !isTemplate && FBStore.mode === "preview":
        mode = FBDRStore.isOutput ? "preupload" : "placeholder";
        break;
      default:
        mode = "qr";
    }

    return Component({
      ...(props as T),
      disabled,
      isTemplate,
      mode,
    });
  };

  return (props: T) => Comp(props);
};
