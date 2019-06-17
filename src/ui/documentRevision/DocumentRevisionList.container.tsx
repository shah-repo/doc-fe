import React from "react";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import { NavLink } from "react-router-dom";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";

interface OwnProps {
  documentRevisions: DocumentRevision[];
  documentId: string;
}

export type DocumentRevisionListContainerProps = OwnProps;

export const DocumentRevisionListContainer: React.FunctionComponent<DocumentRevisionListContainerProps> = ({
  documentRevisions, documentId,
}) => {
  return (
    <React.Fragment>
      {documentRevisions.map((documentRevision) => (
        <NavLink
          to={generateDocumentRevisionVersionPath(documentRevision.id, documentId)}
          key={documentRevision.id}
          activeStyle={{ color: 'gray' }}
        >
          <div>
            Version - {documentRevision.revision}
          </div>
        </NavLink>
      ))}
    </React.Fragment>
  );
};

export default DocumentRevisionListContainer;
