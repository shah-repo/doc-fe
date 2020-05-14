import { Chip, Grid, Typography } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import { styles } from "./DocumentListInfo.styles";

export interface Props {
  documentRevision: DocumentRevision;
}

export const DocumentListInfo: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const classes = styles();
  const isStatusReleased = documentRevision.status === DocumentRevisionStatus.Released;
  const statusIcon = () =>
    <div className={classNames(classes.statusIconDefault, {
      [classes.statusIconReleased]: isStatusReleased,
    })}/>;

  return (
    <Grid container={true} xs={6} alignItems="center">
      <Chip
        label={<Text message={documentRevision.status} />}
        id="DocumentListInfo-status"
        className={classNames(classes.statusDefault, {
          [classes.statusReleased]: isStatusReleased,
        })}
        icon={statusIcon()}
      />
      <Typography variant="h6" id="DocumentListInfo-docId" className={classes.id} >
        {documentRevision.document.docId}
      </Typography>
      <Typography variant="h6" id="DocumentListInfo-name">
        {documentRevision.name}
      </Typography>
    </Grid>
  ); };

export default DocumentListInfo;
