import React from "react";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import { NavLink } from "react-router-dom";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";
import { styles } from "./DocumentRevisionList.container.styles";
import Text from "../components/Text";
import Date from "../components/Date";

interface OwnProps {
  documentRevisions: DocumentRevision[];
  documentId: string;
}

export type DocumentRevisionListContainerProps = OwnProps;

export const DocumentRevisionListContainer: React.FunctionComponent<DocumentRevisionListContainerProps> = ({
  documentRevisions, documentId,
}) => {
  const classes = styles();

  return (
    <React.Fragment>
      {documentRevisions.map((documentRevision) => {
        const link = generateDocumentRevisionVersionPath(documentRevision.id, documentId);

        return (
          <div key={documentRevision.id} className={classes.linkContainer}>
            <NavLink
              to={link}
              activeStyle={{ color: 'gray' }}
              className={classes.linkTitle}
            >
              <div>
                <Text translation="documentRevision.version" /> {documentRevision.revision} - {documentRevision.status}
              </div>
            </NavLink>
            <NavLink
              to={link}
              key={documentRevision.id}
              className={classes.linkBody}
            >
              <div>
                <Text translation="documentRevision.owner" />:
              </div>
              <div>
                <Text translation="documentRevision.released" />: <Date value={documentRevision.released} />
              </div>
            </NavLink>
          </div>
        )
      })}
    </React.Fragment>
  );
};

export default DocumentRevisionListContainer;
