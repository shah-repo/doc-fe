import { FBEditorCustomControlState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";

export interface FBEditorCustomControlProps {
  customControlState?: FBEditorCustomControlState;
  controls?: DocumentRevision[];
  loading?: boolean;
  handleSelect?: (control: DocumentRevision) => any;
}
