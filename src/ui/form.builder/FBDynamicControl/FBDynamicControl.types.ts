import { FBDynamicControlState, FBInputProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";

export type FBDynamicControlProps = Pick<FBInputProps, "index"> & {
  dynamicControlState?: FBDynamicControlState;
  controls?: DocumentRevision[];
  loading?: boolean;
  handleSelect?: (control: DocumentRevision) => any;
};
