import { FBFormProps } from "..";
import { Id } from "../../../state/ducks/common/types";
import FBNotesState from "../FBNotes/FBNotes.state";
import FBNotesFormState from "./FBNotesForm.state";

export type FBNotesFormProps =
& FBFormProps
& {
  handleNote?: () => void;
  files?: Id[];
  notesFormState?: FBNotesFormState;
  name?: string;
  notes?: FBNoteItem[];
  isDraft?: boolean;
  notesState?: FBNotesState;
};

export interface FBNoteItem {
  createdAt: string;
  sender: Id;
  formBuilderFieldName: string;
  attachments: Id[];
  description: string;
  senderName?: string;
  avatar?: string | null;
}

export interface FBNote {
  description: string;
  formBuilderFieldName: string;
  documentRevision: Id;
  attachments: Id[];
}

export interface FBNoteByDocument {
  documentRevisionId: string;
}
