import React from "react";
import { FB, FBControlPicker, FBStarterProps } from "..";
import SM from "../../../App/Shifamed/Utils/SM/SM";

export const withFBStarter = <T extends FBStarterProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    ...props
  }: T) => {

    const { dialogState, leftPanelDialogState } = FB.useStores();
    const { _documentRevisionFormState } = SM.useStores();

    onClick = (index?: number) => {
      // console.log("_documentRevisionFormState::", _documentRevisionFormState?.leftPanelOpen);
      if (!_documentRevisionFormState?.leftPanelOpen) { _documentRevisionFormState?.setLeftPanelOpen(); }
      if (leftPanelDialogState) {
        leftPanelDialogState.setIndex(index || 0);
        leftPanelDialogState.config({
          open: true,
          showLeftPanelEditor: false,
          maxWidth: "sm",
          content: <FBControlPicker {...{ index }} />,
        });
      } else {
      dialogState?.config({
        open: true,
        showLeftPanelEditor: true,
        maxWidth: "sm",
        content: <FBControlPicker {...{ index }} />,
      });
      }
    };

    return Component({
      ...(props as T),
      onClick,
    });

  };

  return (props: T) => Comp(props);
};
