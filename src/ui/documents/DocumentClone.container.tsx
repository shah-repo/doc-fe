import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Document } from "../../state/ducks/documents";
import DocumentCreateContainer from "./DocumentCreate.container";
import { canCloneDocument } from "./helpers";
import { generateDocumentPreviewPath } from "./pathGenerators";
import { DocumentRouteParams } from "./types";

export interface DocumentCloneContainerProps extends RouteComponentProps<DocumentRouteParams> {
  document: Document;
}

export const DocumentCloneContainer: React.FunctionComponent<DocumentCloneContainerProps> = ({
  document, ...routeComponentProps
}) => {
  if (!canCloneDocument(document)) {
    return <Redirect to={generateDocumentPreviewPath(document.id)} />;
  }

  return (
    <DocumentCreateContainer document={document} {...routeComponentProps} />
  );
};

export default DocumentCloneContainer;
