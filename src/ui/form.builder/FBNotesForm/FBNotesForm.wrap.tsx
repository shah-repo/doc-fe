import { isEmpty, map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFormState } from "..";
import FBNotesFormState from "./FBNotesForm.state";
import { FBNoteItem, FBNotesFormProps } from "./FBNotesForm.types";

export const withFBNotesForm = <T extends FBNotesFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    notesFormState,
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
    const formValue: FBNoteItem[] | undefined = isEmpty(notes) ?
      formNotes.filter((note) => note.formBuilderFieldName === name) :
      notes?.filter((note) => note.formBuilderFieldName === name);
    formState = FB.useRef(FBFormState, {});
    notesFormState = FB.useRef(FBNotesFormState, formValue);

    // MARK: Reactions
    React.useEffect(() => {
      reaction(
        () => formState?.inputState.get("noteFile")?.value,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (value) => notesFormState?.setfiles(value),
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
      notesFormState?.setNote(note);
      formState?.reset();
    };

    // MARK: @observer

    useObserver(() => {
      files = notesFormState?.files;
      notes = map(notesFormState?.notes, (note) => {
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
      notesFormState,
      notes,
      files,
    });
  };

  Comp.displayName = "withFBNotesForm";
  return Comp;
};
