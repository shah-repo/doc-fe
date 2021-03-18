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
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState } = FB.useStores();
    const { id = "" } = workspaceState?.document || {};
    dialogState = FB.useRef(FBDialogState);
    notesState = FB.useRef(FBNotesState, {});

    // MARK: Reactions

    // MARK: @helpers

    // MARK: @methods
    onClick = () => {
      notesState?.fetchNotes(id);
      dialogState?.config({
        open: true,
        title: "form.builder.add.note",
        content: <FBNotesForm {...{ name }} notes={notesState?.notes}/>,
      });
    };

    // MARK: @observer

    return  Component({
      ...(props as T),
      onClick,
      dialogState,
      notesState,
    });
  };

  Comp.displayName = "withFBNotes";
  return Comp;
};
