import { map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFormState } from "..";
import FBNotesState from "./FBNotesForm.state";
import { FBNoteItem, FBNotesFormProps } from "./FBNotesForm.types";

export const withFBNotesForm = <T extends FBNotesFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    notesState,
    handleNote,
    files,
    name,
    notes,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState } = FB.useStores();
    const {
      document: {
        id = "",
        notes: formNotes = [],
      } = {},
      company: {
        companyMine: {
          employees = [],
        } = {},
      } = {},
    } = workspaceState || {};
    const formValue: FBNoteItem[] | undefined = formNotes;
    formState = FB.useRef(FBFormState, {});
    notesState = FB.useRef(FBNotesState, formValue);

    // MARK: Reactions
    React.useEffect(() => {
      reaction(
        () => formState?.inputState.get("noteFile")?.value,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (value) => notesState?.setfiles(value),
      );
    }
    );
    // MARK: @helpers

    // MARK: @methods
    handleNote = () => {
      const values = formState?.getValues();
      if (!values) {
        return;
      }
      const note = {
        description: values?.noteText,
        formBuilderFieldName: name as string,
        documentRevision: {
          id,
        },
        attachments: values?.noteFile || [],
      };
      notesState?.setNote(note);
      formState?.reset();
    };

    // MARK: @observer

    useObserver(() => {
      files = notesState?.files;
      notes = map(notesState?.notes, (note) => {
        const sender = employees?.find((employee) => employee.id === note.sender.id )?.user;
        return ({
          ...note,
          senderName: sender?.name,
          avatar: sender?.avatar,
        });
      });
    });

    return  Component({
      ...(props as T),
      handleNote,
      formState,
      notesState,
      notes,
      files,
    });
  };

  Comp.displayName = "withFBNotesForm";
  return Comp;
};
