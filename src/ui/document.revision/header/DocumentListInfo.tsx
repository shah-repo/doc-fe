import { Chip, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";

export interface Props {
  documentRevision: DocumentRevision;
}

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    status: {
      color: "#8A9DAD",
      background: "#F2F4F6",
      padding: "15px 5px",
      borderRadius: "3px",
      fontWeight: "bold",
      marginRight: theme.spacing(2),
    },
    statusIcon: {
      background: "#8A9DAD",
      borderRadius: "50%",
      width: "8px",
      height: "8px",
    },
    id: {
      fontWeight: "bold",
      marginRight: theme.spacing(2),
    },
  },
  ));

export const DocumentListInfo: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const classes = styles();
  return (
    <Grid container={true} xs={6} alignItems="center">
      <Chip
        label={<Text message={documentRevision.status} />}
        id="DocumentListInfo-status"
        className={classes.status}
        icon={<div className={classes.statusIcon}/>}
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
