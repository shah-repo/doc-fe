import React from "react";
import { FB, FBDialogState, FBNotesForm, FBNotesProps } from "..";

export const withFBNotes = <T extends FBNotesProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    dialogState,
    ...props
  }: T) => {

    // MARK: @config
    dialogState = FB.useRef(FBDialogState);


    // MARK: Reactions

    // MARK: @helpers

    // MARK: @methods
    onClick = () => dialogState?.config({
      open: true,
      title: "Add a Note",
      content: <FBNotesForm />,
    });

    // MARK: @observer

    return  Component({
      ...(props as T),
      onClick,
      dialogState,
    });
  };

  Comp.displayName = "withFBNotes";
  return Comp;
};
