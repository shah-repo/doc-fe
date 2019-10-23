import React from "react";
import { NavLink } from "react-router-dom";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import Date from "../components/Date";
import Text from "../components/Text";
import { styles } from "./DocumentRevisionList.container.styles";
import { generateVersionNumber } from "./helpers";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";

interface OwnProps {
  documentRevisions: DocumentRevision[];
  documentId: string;
  docId: string;
}

export type DocumentRevisionListContainerProps = OwnProps;

export const DocumentRevisionListContainer: React.FunctionComponent<
  DocumentRevisionListContainerProps
> = ({ documentRevisions, documentId, docId }) => {
  const classes = styles();

  return (
    <div className={classes.container}>
      {documentRevisions.map((documentRevision) => {
        const link = generateDocumentRevisionVersionPath(
          documentRevision.id,
          documentId,
        );
        return (
          <div key={documentRevision.id} className={classes.linkContainer}>
            <NavLink
              to={link}
              className={classes.linkTitle}
              activeClassName={classes.activeLinkTitle}
            >
              <div>
                <Text translation="documentRevision.version" />
                &nbsp;
                {generateVersionNumber(
                  documentRevision.revision,
                  documentRevision.revisionStage,
                )}
                &nbsp;
                - {documentRevision.status}
              </div>
            </NavLink>
            <NavLink
              to={link}
              key={documentRevision.id}
              className={classes.linkBody}
            >
              <div>
                <Text translation="common.title" />
                :&nbsp;
                {documentRevision.name}
              </div>
              <div>
                <Text translation="common.documentId" />
                :&nbsp;
                {docId}
              </div>
              <div>
                <Text translation="common.owner" />
                :&nbsp;
                {documentRevision.owner.name}
              </div>
              <div>
                <Text translation="documentRevision.released" />
                :&nbsp;
                <Date
                  value={
                    documentRevision.obsoletedAt || documentRevision.releasedAt
                  }
                />
              </div>
            </NavLink>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentRevisionListContainer;
