import React from "react";
import { DocumentRevision } from "../../state/ducks/documentRevisions";

interface OwnProps {
  documentRevisions: DocumentRevision[];
}

export type DocumentRevisionListContainerProps = OwnProps;

export const DocumentRevisionListContainer: React.FunctionComponent<DocumentRevisionListContainerProps> = ({
  documentRevisions,
}) => {
  return (
    <div>
      {documentRevisions.map((revision) => revision.id)}
    </div>
  );
};

export default DocumentRevisionListContainer;
