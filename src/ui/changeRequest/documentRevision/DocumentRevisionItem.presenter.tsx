import React from 'react';
import { Grid, IconButton, Tooltip } from '@material-ui/core';
import { RemoveCircleOutline } from "@material-ui/icons";
import { DocumentRevision } from '../../../state/ducks/documentRevisions';
import Text from "../../components/Text";
import Date from "../../components/Date";

interface OwnProps {
  documentRevision: DocumentRevision;
  onDelete?: () => void;
  onClick: () => void;
}

export type DocumentRevisionItemPresenterProps = OwnProps;

export const DocumentRevisionItemPresenter: React.FunctionComponent<DocumentRevisionItemPresenterProps> = ({
  onClick, onDelete, documentRevision
}) => {
  return (
    <div
      style={{
        margin: "10px 0",
        lineHeight: '23px',
        borderBottom: "1px solid lightgray",
        width: "100%",
        cursor: "pointer",
      }}
    >
      <Grid container={true}>
        <Grid item={true} xs={10}>
          <div
            onClick={onClick}
          >
            <Tooltip title={documentRevision.name} aria-label={documentRevision.name}>
              <div
                style={{
                  overflow: "hidden", 
                  whiteSpace: "nowrap", 
                  textOverflow: "ellipsis",
                  color: "red",
                }}
              >
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