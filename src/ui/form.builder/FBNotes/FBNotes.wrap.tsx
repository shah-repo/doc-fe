import React from "react";
import { FB, FBDialogState } from "..";
import FBNotesForm from "../FBNotesForm/FBNotesForm";
import { FBNotesProps } from "./FBNotes.types";

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
      title: "form.builder.add.note",
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
