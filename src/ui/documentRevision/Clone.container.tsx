import React from "react";
import { Redirect } from "react-router-dom";
import { DocumentRevision, documentRevisionsActions } from "../../state/ducks/documentRevisions";
import { canCreateNewVersion } from "./helpers";
import { documentVersionPath } from "../document.revision/utils/paths";
import DocumentRevisionCreateContainer from "./DocumentRevisionCreate.container";

export interface OwnProps {
  documentRevision: DocumentRevision;
}

type CloneContainerProps = OwnProps;

export const CloneContainer: React.FunctionComponent<CloneContainerProps> = ({
  documentRevision
}) => {
  if (!canCreateNewVersion(documentRevision)) {
    return <Redirect to={documentVersionPath(documentRevision.id, documentRevision.document.id)} />;
  }

  return (
    <DocumentRevisionCreateContainer documentRevision={documentRevision} />
  );
};

export default CloneContainer
