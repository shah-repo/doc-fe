import React from "react";
import { FB, FBDialogState, FBNotesForm, FBNotesProps } from "..";

export const withFBNotes = <T extends FBNotesProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    dialogState,
    name,
    notesNumber,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState } = FB.useStores();
    const {
      document: {
        notes = [],
      } = {},
    } = workspaceState || {};
    dialogState = FB.useRef(FBDialogState);
    notesNumber = notes.filter((note) => note.formBuilderFieldName === name).length;

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
      notesNumber,
    });
  };

  Comp.displayName = "withFBNotes";
  return Comp;
};
