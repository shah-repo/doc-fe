import { FBAutocompleteProps, FBDialogState, FBDocumentRevisionsState } from "..";
import { Id } from "../../../state/ducks/common/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBInputProps } from "../FBInput/FBInput.types";

export type FBDocumentRevisionProps =
& Pick<FBInputProps, "disabled" | "name">
& {
  handleAdd: () => void;
  dialogState?: FBDialogState;
  docRevState?: FBDocumentRevisionsState;
  documentRevisions?: FBDocumentRevisionItem[];
};

export type FBProposedDocumentProps =
& Pick<FBInputProps, "disabled" | "index">
& {
  setMouseInside?: (isMouseInside: boolean) => void;
  removeDocument?: (id: string) => void;
  handleOpen?: () => void;
  id: string;
  proposedDocumentRevision?: DocumentRevision;
  isMouseInside?: boolean;
  justification: string;
  description: string;
  handleEdit?: (e: React.ChangeEvent<any>, index: number, type: string) => void;
};

export interface FBDocumentRevisions {
  documentRevisions: FBDocumentRevisionItem[];
}

export interface FBDocumentRevisionItem {
  proposedDocumentRevision: Id;
  justificationOfChange: string;
  descriptionOfChange: string;
  id: string;
}

export interface FBDocumentRevisionFormProps {
  getOptionDisabled?: FBAutocompleteProps["getOptionDisabled"];
}
