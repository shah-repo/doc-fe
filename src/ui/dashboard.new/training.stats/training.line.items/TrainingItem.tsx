import {
  Avatar,
  Grid,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/training/types";
import { styles } from "./TrainingItem.styles";

interface TrainingItemProps {
  avatar: string | null;
  firstName: string;
  documentId: string;
  title: string;
  status: string;
  date: string;
}

const TrainingItem: React.FunctionComponent<TrainingItemProps> = ({
  firstName,
  status,
  date,
  documentId,
  title,
}) => {
  const classes = styles();
  const isOverdue = status === TrainingStatusChartLabelTypes.OVERDUE;

  const titleRender = (firstName, status, documentId, title, date) => (
    <Typography>
      <Grid justify="space-between" container>
        <Grid item className={classes.avatarSection}>
          <Avatar className={classes.avatar} alt={firstName} src="." />
          <span className={classes.name}>{firstName}</span>
        </Grid>
        <Grid item>
          {isOverdue && (
            <span className={classes.typographyOverdue}>{status}</span>
          )}
          {!isOverdue && (
            <span className={classes.typographyDueInfewDays}>{status}</span>
          )}
        </Grid>
      </Grid>
      <Grid
        container={true}
        wrap="nowrap"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item={true}>
          <b className={classes.docIdAndTitle}>{documentId}</b>
        </Grid>
        &nbsp;
        <Grid item={true}>
          <span
            className={classes.docIdAndTitle}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </Grid>
      </Grid>
      <Grid
        container={true}
        wrap="nowrap"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item={true}>
          <small className={classes.date}>Due date: {date}</small>
        </Grid>
      </Grid>
    </Typography>
  );

  return (
    <ListItem>
      <ListItemText
        id={documentId}
        primary={titleRender(firstName, status, documentId, title, date)}
      />
    </ListItem>
  );
};

export default TrainingItem;
