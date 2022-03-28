import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import styles from "./common.styles";
import UserIcon from "./test_user_Avatar.jpg";

const UserAvatar: React.FunctionComponent<any> = () => {
  const classes = styles();
  return (
    <ListItem
      alignItems="flex-start"
      disableGutters
      style={{
        minWidth: "35px",
      }}
    >
      <ListItemAvatar>
        <Avatar alt="test" src={UserIcon} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography className={classes.generalInfo}>
            Maureen Gamarra
          </Typography>
        }
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
              className={classes.secondaryText}
            >
              Feb 04, 2022 09:28 AM
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default UserAvatar;
