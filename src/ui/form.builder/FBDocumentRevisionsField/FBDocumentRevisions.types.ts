import { FBDialogState, FBDocumentRevisionsState } from "..";
import { Id } from "../../../state/ducks/common/types";
import { FBInputProps } from "../FBInput/FBInput.types";

export type FBDocumentRevisionProps =
& Pick<FBInputProps, "disabled" | "name" >
& {
  dialogState?: FBDialogState;
  docRevState?: FBDocumentRevisionsState;
  onClick: () => void;
  removeDocument: (index: number) => void;
};

export interface DocumentRevisions {
  documentRevisions: DocumentRevisionItem[];
}

export interface DocumentRevisionItem {
  documentRevision: Id;
  justificationOfChange: string;
  descriptionOfChange: string;
  id: string;
}
