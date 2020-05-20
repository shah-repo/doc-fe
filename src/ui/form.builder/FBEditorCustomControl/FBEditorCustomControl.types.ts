import { FBEditorCustomControlState, FBInputProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";

export type FBEditorCustomControlProps =
& Pick<FBInputProps, "index">
& {
  customControlState?: FBEditorCustomControlState;
  controls?: DocumentRevision[];
  loading?: boolean;
  handleSelect?: (control: DocumentRevision) => any;
};
