import classNames from "classnames";
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
  selectedDocumentRevision: string;
}

export type DocumentRevisionListContainerProps = OwnProps;

// TODO: check if this component is used
export const DocumentRevisionListContainer: React.FunctionComponent<
  DocumentRevisionListContainerProps
> = ({ documentRevisions, documentId, docId, selectedDocumentRevision }) => {
  const classes = styles();

  return (
    <div className={classes.container}>
      {documentRevisions.map((documentRevision) => {
        const link = generateDocumentRevisionVersionPath(
          documentRevision.id,
          documentId,
        );
        const isSelected = selectedDocumentRevision === documentRevision.id;
        return (
          <div
            key={documentRevision.id}
            className={classNames(classes.linkContainer, {
              [classes.selected]: isSelected,
            })}
          >
            <NavLink
              to={link}
              className={classes.linkTitle}
              activeClassName={classes.activeLinkTitle}
            >
              <div>
                <Text translation="common.version" />
                &nbsp;
                {generateVersionNumber(
                  documentRevision.revision,
                  documentRevision.revisionStage,
                )}
                &nbsp; - {documentRevision.status}
              </div>
            </NavLink>
            <NavLink
              to={link}
              key={documentRevision.id}
              className={classes.linkBody}
            >
              <div>
                <Text translation="common.docId" />:{" "}
                {docId}
              </div>
              <div>
                <Text translation="common.title" />:{" "}
                {documentRevision.name}
              </div>
              <div>
                <Text translation="common.owner" />:{" "}
                {documentRevision.owner.name}
              </div>
              <div>
                <Text translation="common.released" />:{" "}
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
