import { Grid, IconButton } from "@material-ui/core";
import { RemoveCircleOutline } from "@material-ui/icons";
import classNames from "classnames";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import SummaryInfo from "../../common/summary/SummaryInfo";
import Date from "../../components/Date";
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
      id="documentRevisionItem"
      className={classNames(classes.container, {
        [classes.selected]: isSelected,
      })}
    >
      <Grid container={true}>
        <Grid item={true} xs={10}>
          <div onClick={onClick}>
            <div className={isSelected ? classes.item : classes.itemSelected}>
              <SummaryInfo
                label="common.docId"
                value={documentRevision.document.docId}
                data-testid="Document-id"
              />
            </div>
            <SummaryInfo label="common.title" value={documentRevision.name} data-testid="Document-title" />
            <SummaryInfo
              label="common.version"
              value={generateVersionNumber(
                documentRevision.revision,
                documentRevision.revisionStage,
                documentRevision.revisionChangeType,
              )}
              data-testid="Document-version"
            />
            <SummaryInfo
              label="common.owner"
              value={documentRevision.owner && documentRevision.owner.user.name}
              data-testid="Document-owner"
            />
            <SummaryInfo
              label="common.released"
              value={
                <Date
                  value={
                    documentRevision.obsoletedAt || documentRevision.releasedAt
                  }
                />
              }
              data-testid="Document-released"
            />
          </div>
        </Grid>
        <Grid item={true} xs={1}>
          {onDelete && (
            <IconButton color="secondary" onClick={onDelete} aria-label="Close" id="Document-close">
              <RemoveCircleOutline />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default DocumentRevisionItemPresenter;
