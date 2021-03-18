import React from "react";
import { FB, FBDialogState, FBNotesForm, FBNotesProps } from "..";

export const withFBNotes = <T extends FBNotesProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    dialogState,
    name,
    ...props
  }: T) => {

    // MARK: @config
    dialogState = FB.useRef(FBDialogState);

    // MARK: Reactions

    // MARK: @helpers

    // MARK: @methods
    onClick = () => {
      dialogState?.config({
        open: true,
        title: "form.builder.add.note",
        content: <FBNotesForm {...{ name }} />,
      });
    };

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
