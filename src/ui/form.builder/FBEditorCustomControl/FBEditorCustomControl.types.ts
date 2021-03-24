import { FBEditorCustomControlState, FBInputProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";

export type FBEditorCustomControlProps =
& Pick<FBInputProps, "index">
& {
  customControlState?: FBEditorCustomControlState;
  controls?: DocumentRevision[];
  loading?: boolean;
  handleSelect?: (control: DocumentRevision) => any;
};
