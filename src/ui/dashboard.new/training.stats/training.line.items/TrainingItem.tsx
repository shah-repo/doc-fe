import {
  Avatar,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";
import { styles } from "./TrainingItem.styles";

interface TrainingItemProps {
  avatar: string;
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
  const isOverdue = status === "OVERDUE" ? true : false;
  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);

  const titleRender = (firstName, status, documentId, title, date) => (
    <Typography display="inline" className={classes.titletext}>
      <Grid
        justify="space-between" // Add it here :)
        container
      >
        <Grid item>
          <b>{firstName}</b>
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
      <b className={classes.biggerFont}>{documentId}</b>
      <b className={classes.biggerFont}> {title}</b>
      <br />
      <small>Date: {date}</small>
    </Typography>
  );

  return (
    <StyledListItem button className={classes.listitem}>
      <ListItemAvatar>
        <Avatar alt={firstName} src="." />
      </ListItemAvatar>
      <ListItemText
        id={documentId}
        primary={titleRender(firstName, status, documentId, title, date)}
      />
    </StyledListItem>
  );
};

export default TrainingItem;
