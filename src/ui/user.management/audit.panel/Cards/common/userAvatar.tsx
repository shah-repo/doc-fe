import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import UserAvatar from "../../../../app/UserMenu/UserAvatar";
import styles from "./common.styles";

const UserAvatarCard: React.FunctionComponent<any> = ({
  timestamp,
  // TODO:Check if required
  ownerEmail, ownerId, ownerName, avatar, initialColor, name,
}) => {
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
        <UserAvatar {...{ avatar, initialColor, name }} />
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography className={classes.generalInfo}>
            {ownerName}
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
              {timestamp}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default UserAvatarCard;
