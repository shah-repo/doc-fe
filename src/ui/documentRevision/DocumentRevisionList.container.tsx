import classNames from "classnames";
import React from "react";
import { NavLink } from "react-router-dom";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import SummaryInfo from "../common/summary/SummaryInfo";
import Date from "../components/Date";
import Text from "../components/Text";
import { documentVersionPath } from "../document.revision/utils/paths";
import { styles } from "./DocumentRevisionList.container.styles";
import { generateVersionNumber } from "./helpers";

interface OwnProps {
  documentRevisions: DocumentRevision[];
  documentId: string;
  docId: string;
  selectedDocumentRevision: string;
}

export type DocumentRevisionListContainerProps = OwnProps;

// used by the document revision manager container
export const DocumentRevisionListContainer: React.FunctionComponent<
  DocumentRevisionListContainerProps
> = ({ documentRevisions, documentId, docId, selectedDocumentRevision }) => {
  const classes = styles();

  return (
    <div className={classes.container}>
      {documentRevisions.map((documentRevision) => {
        const link = documentVersionPath(
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
              <SummaryInfo label="common.docId" value={docId} />
              <SummaryInfo label="common.title" value={documentRevision.name} />
              <SummaryInfo label="common.owner" value={documentRevision.owner.user.name} />
              <SummaryInfo
                label="common.released"
                value={
                  <Date
                    value={documentRevision.obsoletedAt || documentRevision.releasedAt}
                  />}
              />
            </NavLink>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentRevisionListContainer;
