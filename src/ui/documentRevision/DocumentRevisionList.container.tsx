import React from "react";
import { NavLink } from "react-router-dom";
import { DocumentRevision } from "../../state/ducks/documentRevisions";
import Date from "../components/Date";
import Text from "../components/Text";
import { styles } from "./DocumentRevisionList.container.styles";
import { generateDocumentRevisionVersionPath } from "./pathGenerators";

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
    <React.Fragment>
      {documentRevisions.map((documentRevision) => {
        const link = generateDocumentRevisionVersionPath(
          documentRevision.id,
          documentId,
        );

        return (
          <div key={documentRevision.id} className={classes.linkContainer}>
            <NavLink
              to={link}
              activeStyle={{ color: "gray" }}
              className={classes.linkTitle}
            >
              <div>
                <Text translation="documentRevision.version" />{" "}
                {documentRevision.version} - {documentRevision.status}
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
                <Date value={documentRevision.releasedAt} />
              </div>
            </NavLink>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default DocumentRevisionListContainer;
