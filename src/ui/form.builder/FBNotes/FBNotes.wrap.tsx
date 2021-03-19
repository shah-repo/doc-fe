import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBNotesForm, FBNotesProps } from "..";
import FBNotesState from "./FBNotes.state";

export const withFBNotes = <T extends FBNotesProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    dialogState,
    name,
    notesState,
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
    notesState = FB.useRef(FBNotesState, notesNumber);

    // MARK: Reactions

    // MARK: @helpers

    // MARK: @methods
    onClick = () => {
      dialogState?.config({
        open: true,
        title: "form.builder.add.note",
        content: <FBNotesForm {...{ name, notesState }} />,
      });
    };

    // MARK: @observer
    useObserver(() => {
      notesNumber = notesState?.noteNumber;
    });

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
