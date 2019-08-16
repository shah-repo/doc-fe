import { Grid, IconButton, Tooltip } from "@material-ui/core";
import { RemoveCircleOutline } from "@material-ui/icons";
import React from "react";
import classNames from "classnames";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { CardTooltip } from "../../components/cards/FileCard.styles";
import Date from "../../components/Date";
import Text from "../../components/Text";
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
  const classes = styles();
  const isSelected = selectedDocumentRevision === documentRevision.id;

  return (
    <div
      className={
        classNames(classes.container, { [classes.selected]: isSelected })
      }
    >
      <Grid container={true}>
        <Grid item={true} xs={10}>
          <div onClick={onClick}>
            <CardTooltip
              title={documentRevision.name}
              aria-label={documentRevision.name}
            >
              <div className={classes.title}>{documentRevision.name}</div>
            </CardTooltip>
            <div>
              <Text translation="common.version" />
              :&nbsp;
              {documentRevision.version}
            </div>
            <div>
              <Text translation="common.created" />
              :&nbsp;
              <Date value={documentRevision.createdAt} />
            </div>
            <div>
             <Text translation="common.documentId" />
             :&nbsp;
             {documentRevision.document.docId}
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
