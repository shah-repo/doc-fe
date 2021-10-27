import { Avatar, Grid, ListItem, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/training/types";
import { styles } from "./TrainingItem.styles";

interface TrainingItemProps {
  avatar: string;
  firstName: string;
  documentId: string;
  title: string;
  status: string;
  date: string;
}

const TrainingItem: React.FunctionComponent<TrainingItemProps> = ({ firstName, status, date, documentId, title }) => {
  const classes = styles();
  const isOverdue = status === TrainingStatusChartLabelTypes.OVERDUE;

  const titleRender = (firstName, status, documentId, title, date) => (
    <Typography>
      <Grid
        justify="space-between"
        container
      ><Grid item className={classes.avatarSection}>
          <Avatar className={classes.avatar} alt={firstName} src="." />
          <span className={classes.name}>{firstName}</span>
        </Grid>
        <Grid item>
          { isOverdue && <span className={classes.typographyOverdue}>{status}</span>}
          { !isOverdue && <span className={classes.typographyDueInfewDays}>{status}</span>}
        </Grid>
      </Grid>
      <b className={classes.docIdAndTitle}>{documentId}</b>
      <b className={classes.docIdAndTitle}> {title}</b>
      <br />
      <small className={classes.date}>Date: {date}</small>
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
