import React from "react";
import { FB, FBDialogState, FBEBPartDialog } from "..";
import { FBEBPartProps } from "./FBEBPart.types";

export const withFBEBPart = <T extends FBEBPartProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    dialogState,
    name,
    ...props
  }) => {

    // MARK: @config
    dialogState = FB.useRef(FBDialogState);

    // MARK: @methods
    const onAddClick = () => {
      dialogState?.config({
        title: "form.builder.create.new.part",
        open: true,
        content: <FBEBPartDialog { ...{ name }}  />,
      });
    };

    return Component({
      ...(props as T),
      dialogState,
      onAddClick,
    });
  };

  Comp.displayName = "withFBEBPart";
  return Comp;
};
