import { FBDynamicControlState } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";

export interface FBDynamicControlProps {
  dynamicControlState?: FBDynamicControlState;
  controls?: DocumentRevision[];
  loading?: boolean;
  handleSelect?: (control: DocumentRevision) => any;
}
