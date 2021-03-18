import { map } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFormState, FBNoteItem, FBNotesFormProps } from "..";
import { isDocumentRevisionInDraft } from "../../documentRevision/helpers/documentRevisionStatus";
import FBNotesFormState from "./FBNotesForm.state";

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
    isDraft,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState } = FB.useStores();
    const {
      document: {
        id = "",
        status = undefined,
      } = {},
      company: {
        companyMine: {
          employees = [],
        } = {},
      } = {},
    } = workspaceState || {};
    formState = FB.useRef(FBFormState, {});
    notesFormState = FB.useRef(FBNotesFormState, {});
    isDraft = isDocumentRevisionInDraft(status);

    // MARK: Reactions

    React.useEffect(() => {
      if (!id) {
        return;
      }
      notesFormState?.fetchNotes(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
      formState?.setFieldValue("noteText", undefined, true);
      formState?.reset();
    };

    // MARK: @observer

    useObserver(() => {
      files = notesFormState?.files;
      notes = map(notesFormState?.notes, (note) => {
        const sender = employees?.find((employee) => employee.id === note.sender?.id )?.user;
        if (note.formBuilderFieldName !== name) {
          return;
        }
        return ({
          ...note,
          senderName: sender?.name,
          avatar: sender?.avatar,
        });
      }).filter(Boolean) as FBNoteItem[];
    });

    return  Component({
      ...(props as T),
      handleNote,
      formState,
      notesFormState,
      isDraft,
      notes,
      files,
    });
  };

  Comp.displayName = "withFBNotesForm";
  return Comp;
};
