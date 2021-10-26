import { Avatar, Grid, ListItem, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { styles } from "./TrainingItem.styles";

interface TrainingItemProps {
  avatar: string;
  firstName: string;
  documentId: string;
  title: string;
  status: string;
  date: string;
}

function TrainingItem(props: TrainingItemProps) {
  const classes = styles();
  const { firstName, status, date, documentId, title } = props;
  const isOverdue = status === "OVERDUE" ? true : false;

  const titleRender = (firstName, status, documentId, title, date) => (
    <Typography>
      <Grid
        justify="space-between"
        container
      ><Grid item className={classes.avatarSection}>
          {/* <ListItemAvatar> */}
          <Avatar className={classes.avatar} alt={firstName} src="." />
          {/* </ListItemAvatar> */}
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
    // <List className={classes.root}>
    // <ListItem className={classes.listitem}>
    <ListItem>
      <ListItemText
        id={documentId}
        primary={titleRender(firstName, status, documentId, title, date)}
      />
    </ListItem>
    // </List>
  );
}

export default TrainingItem;
