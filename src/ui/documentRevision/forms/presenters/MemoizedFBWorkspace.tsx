import * as React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import FBWorkspaceForm from "../../../form.builder/containers/workspace/FBWorkspaceForm";

interface Props {
  id?: string;
  documentId?: string;
  document: DocumentRevision;
}

const MemoizedFBWorkspace: React.FunctionComponent<Props> = ({
  ...props
}) => (
  <FBWorkspaceForm {...props} />
);

// document won't be checked because it changes on ever keystroke
// document is passed only the first time
// if this causes any issues we can adjust this to check for document status, outputRevision, etc.
const areEqual = (prevProps: Props, nextProps: Props) =>
  prevProps.id === nextProps.id && prevProps.documentId === nextProps.documentId;

export default React.memo(MemoizedFBWorkspace, areEqual);
