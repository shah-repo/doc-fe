import {
  Avatar,
  Grid,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { TrainingStatusTypes } from "../../../../state/ducks/dashboard.new/training.stats/types";
import Text from "../../../components/Text";
import { styles } from "./TrainingItem.styles";

interface TrainingItemProps {
  avatar: string | null;
  name: string;
  documentId: string;
  title: string;
  status: string;
  date: string;
}

const TrainingItem: React.FunctionComponent<TrainingItemProps> = ({
  name,
  status,
  date,
  documentId,
  title,
}) => {
  const classes = styles();
  const isOverdue = status === TrainingStatusTypes.OVERDUE;

  const titleRender = (name, status, documentId, title, date) => (
    <Typography>
      <Grid justify="space-between" container>
        <Grid item className={classes.avatarSection}>
          <Avatar className={classes.avatar} alt={name} src="." />
          <Typography
            component="span"
            variant="body2"
            className={classes.name}
            color="textPrimary"
          >
            {name}
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
              <Text translation="training.stats.overdue" />
            </Typography>
          )}
          {!isOverdue && (
            <Typography
              component="span"
              variant="body2"
              className={classes.typographyDueInfewDays}
              color="textPrimary"
            >
              <Text translation="training.stats.duein7days" />
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
            className={`${classes.docIdAndTitle} ${classes.margin5}`}
            color="textPrimary"
          >
            {documentId}
          </Typography>
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
            <Text translation="common.due.date" />: {date}
          </Typography>
        </Grid>
      </Grid>
    </Typography>
  );

  return (
    <ListItem>
      <ListItemText
        id={documentId}
        primary={titleRender(name, status, documentId, title, date)}
      />
    </ListItem>
  );
};

export default React.memo(TrainingItem);
