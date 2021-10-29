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
          <Typography
            component="span"
            variant="body2"
            className={classes.name}
            color="textPrimary"
          >
            {firstName}
          </Typography>
        </Grid>
        <Grid item>
          {isOverdue && (
            <Typography
              component="span"
              variant="body2"
              className={classes.typographyOverdue}
              color="textPrimary"
            >
              {status}
            </Typography>
          )}
          {!isOverdue && (
            <Typography
              component="span"
              variant="body2"
              className={classes.typographyDueInfewDays}
              color="textPrimary"
            >
              {status}
            </Typography>
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
          <Typography
            component="span"
            variant="body2"
            className={classes.docIdAndTitle}
            color="textPrimary"
          >
            {documentId}
          </Typography>
          &nbsp;
        </Grid>
        <Grid item={true}>
          <Typography
            component="span"
            variant="body2"
            className={classes.docIdAndTitle}
            color="textPrimary"
            dangerouslySetInnerHTML={{ __html: title }}
          ></Typography>
        </Grid>
      </Grid>
      <Grid
        container={true}
        wrap="nowrap"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item={true}>
          <Typography
            component="span"
            variant="body2"
            className={classes.date}
            color="textPrimary"
          >
            Due date: {date}
          </Typography>
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
