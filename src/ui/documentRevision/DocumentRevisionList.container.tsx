import React from "react";
import { NavLink } from "react-router-dom";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import Date from "../components/Date";
import Text from "../components/Text";
import { styles } from "./DocumentRevisionList.container.styles";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";
import { generateVersionNumber } from "./helpers";

interface OwnProps {
  documentRevisions: DocumentRevision[];
  documentId: string;
}

export type DocumentRevisionListContainerProps = OwnProps;

export const DocumentRevisionListContainer: React.FunctionComponent<
  DocumentRevisionListContainerProps
> = ({ documentRevisions, documentId }) => {
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
              activeStyle={{ color: "#0066FF", background: "#f0f0f0" }}
              className={classes.linkTitle}
            >
              <div>
                <Text translation="documentRevision.version" />{" "}
                {generateVersionNumber(
                  documentRevision.revision,
                  documentRevision.revisionStage,
                )}{" "}
                - {documentRevision.status}
              </div>
            </NavLink>
            <NavLink
              to={link}
              key={documentRevision.id}
              className={classes.linkBody}
            >
              <div>
                <Text translation="common.owner" />:{" "}
                {documentRevision.owner.name}
              </div>
              <div>
                <Text translation="documentRevision.released" />:{" "}
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
