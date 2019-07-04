import React from 'react';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import { RemoveCircleOutline } from "@material-ui/icons";
import { DocumentRevision } from '../../../state/ducks/documentRevisions';
import Text from "../../components/Text";
import Date from "../../components/Date";
import { styles } from "./DocumentRevisionItem.styles";

interface OwnProps {
  documentRevision: DocumentRevision;
  onDelete?: () => void;
  onClick: () => void;
}

export type DocumentRevisionItemPresenterProps = OwnProps;

export const DocumentRevisionItemPresenter: React.FunctionComponent<DocumentRevisionItemPresenterProps> = ({
  onClick, onDelete, documentRevision
}) => {
  const classes = styles();

  return (
    <div className={classes.container}>
      <Grid container={true}>
        <Grid item={true} xs={10}>
          <div
            onClick={onClick}
          >
            <Tooltip title={documentRevision.name} aria-label={documentRevision.name}>
              <div className={classes.title}>
                {documentRevision.name}
              </div>
            </Tooltip>
            <div>
              <Text translation="common.version" />:&nbsp;
              {documentRevision.version}
            </div>
            <div>
              <Text translation="common.created" />:&nbsp;
              <Date value={documentRevision.createdAt} />
            </div>
          </div>
        </Grid>
        <Grid item={true} xs={1}>
          {
            onDelete && (
              <IconButton color="secondary" onClick={onDelete} aria-label="Close">
                <RemoveCircleOutline />
              </IconButton>
            )
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default DocumentRevisionItemPresenter;