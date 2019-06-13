import { List, ListItem, ListItemText, Paper, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { Document } from "../../state/ducks/documents";
import Text from "../components/Text";
import { generateDocumentPreviewPath } from "../documents/pathGenerators";
import styles from "./DocumentReviews.styles";

interface Props extends WithStyles<typeof styles> {
  documentsToReview: Document[];
}

const DocumentReviews: React.FunctionComponent<Props> = ({ classes, documentsToReview }) => {
  const reviews = documentsToReview.map((document: Document) => (
    <Link key={document.id} className={classes.link} to={generateDocumentPreviewPath(document.id)}>
      <ListItem button={true} divider={true}>
        <ListItemText primary={document.name} secondary={document.type} />
      </ListItem>
    </Link>
  ));

  const noReviews = reviews.length === 0 && (
    <Typography className={classes.noReviews}>
      <Text translation="dashboard.noReviews" />
    </Typography>
  );

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        <Text translation="dashboard.reviews" />
      </Typography>
      {reviews.length > 0 && <List>{reviews}</List>}
      {noReviews}
    </Paper>
  );
};

export default withStyles(styles)(DocumentReviews);
