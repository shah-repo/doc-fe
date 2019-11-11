import { Grid, IconButton, Tooltip } from "@material-ui/core";
import { RemoveCircleOutline } from "@material-ui/icons";
import classNames from "classnames";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Date from "../../components/Date";
import Text from "../../components/Text";
import { generateVersionNumber } from "../../documentRevision/helpers";
import { styles } from "./DocumentRevisionItem.styles";

interface OwnProps {
  documentRevision: DocumentRevision;
  onDelete?: () => void;
  onClick: () => void;
  selectedDocumentRevision: string;
}

export type DocumentRevisionItemPresenterProps = OwnProps;

export const DocumentRevisionItemPresenter: React.FunctionComponent<
  DocumentRevisionItemPresenterProps
> = ({ onClick, onDelete, documentRevision, selectedDocumentRevision }) => {
  if (!documentRevision) {
    return null;
  }

  const classes = styles();
  const isSelected = selectedDocumentRevision === documentRevision.id;

  return (
    <div
      className={classNames(classes.container, {
        [classes.selected]: isSelected,
      })}
    >
      <Grid container={true}>
        <Grid item={true} xs={10}>
          <div onClick={onClick}>
            <Tooltip
              title={documentRevision.name}
              aria-label={documentRevision.name}
            >
              <div
                className={isSelected ? classes.titleSelected : classes.title}
              >
                {documentRevision.name}
              </div>
            </Tooltip>
            <div>
              <Text translation="common.version" />:{" "}
              {generateVersionNumber(
                documentRevision.revision,
                documentRevision.revisionStage,
              )}
            </div>
            <div>
              <Text translation="common.documentId" />:{" "}
              {documentRevision.document.docId}
            </div>
            <div>
                <Text translation="common.owner" />:{" "}
                {documentRevision.owner && documentRevision.owner.name}
            </div>
            <div>
              <Text translation="common.released" />:{" "}
                <Date
                  value={
                    documentRevision.obsoletedAt || documentRevision.releasedAt
                  }
                />
            </div>
          </div>
        </Grid>
        <Grid item={true} xs={1}>
          {onDelete && (
            <IconButton color="secondary" onClick={onDelete} aria-label="Close">
              <RemoveCircleOutline />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default DocumentRevisionItemPresenter;
