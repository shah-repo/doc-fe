import { Paper, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { Document } from "../../state/ducks/documents";
import Text from "../components/Text";
import { generateDocumentEditPath } from "../documents/pathGenerators";
import styles from "./DocumentReviews.styles";

interface Props extends WithStyles<typeof styles> {
  documentsToReview: Document[];
}

const DocumentReviews: React.FunctionComponent<Props> = ({ classes, documentsToReview }) => {
  const reviews = documentsToReview.map((document: Document) => {
    return (
      <Link key={document.id} className={classes.link} to={generateDocumentEditPath(document.id)}>
        {document.name}
      </Link>
    );
  });

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom={true}>
        <Text translation="dashboard.reviews" />
      </Typography>
      {documentsToReview.length ? reviews : <Text translation="dashboard.noReviews" />}
    </Paper>
  );
};

export default withStyles(styles)(DocumentReviews);
