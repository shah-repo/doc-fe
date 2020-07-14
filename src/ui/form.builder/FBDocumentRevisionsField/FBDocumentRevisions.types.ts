import { FBAutocompleteProps, FBDialogState, FBDocumentRevisionsState } from "..";
import { Id } from "../../../state/ducks/common/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { FBInputProps } from "../FBInput/FBInput.types";

export type FBDocumentRevisionProps =
& Pick<FBInputProps, "disabled" | "name" >
& FBProposedDocumentProps
& {
  dialogState?: FBDialogState;
  docRevState?: FBDocumentRevisionsState;
  onClick: () => void;
  removeDocument: (index: number) => void;
};

export interface FBProposedDocumentProps {
  id: string;
  proposedDocumentRevision: DocumentRevision;
  isMouseInside: boolean;
  setMouseInside: (isMouseInside: boolean) => void;
  justification: string;
  description: string;
  index: number;
  removeDocument: (index: number) => void;
  disabled: boolean;
}

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
