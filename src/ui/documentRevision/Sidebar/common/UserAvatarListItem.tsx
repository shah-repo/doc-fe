import { Avatar, createStyles, ListItem, ListItemAvatar, ListItemText, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { User } from "../../../../state/ducks/common/types";
import { getInitalsFromName } from "../../../components/icons/avatar/helpers";
import Colors from "../../../layout/theme/utils/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    auditListItem: {
      margin: "0px",
      padding: "0px",
      marginBottom: "12px",
    },
    primaryText: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "21px",
      color: Colors.dark_jungle_green,
    },
    secondaryText: {
      fontSize: "12px",
      color: Colors.font_gray,
    },
    avatar: ({ initialColor }) => ({
      width: "35px",
      height: "35px",
      fontWeight: 600,
      color: Colors.white,
      borderRadius: "50%",
      fontSize: "12px",
      background: `${initialColor}`,
    }),
  }));

interface Props {
  user: User;
  secondaryComponent: JSX.Element;
  name: string | JSX.Element;
}


const UserAvatarListItem: React.FunctionComponent<Props> = ({
  user,
  secondaryComponent,
  name,
}) => {
  const classes = useStyles({ initialColor: user?.initialColor });

  const intl = useIntl();
  const defaultName = intl.formatMessage({ id: "user.management.audit.history.Unknown" });

  return (
    <>
      <ListItem alignItems="flex-start" disableGutters className={classes.auditListItem}>
        <ListItemAvatar data-cy="user-avatar" style={{ minWidth: 42 }}>
          {user?.avatar ? (
            <Avatar
              className={classes.avatar}
              alt={user?.name}
              src={user?.avatar || ""}
            />
          ) : (
            <Avatar
              className={classes.avatar}
              style={{ background: user?.initialColor }}
            >
              {getInitalsFromName(user?.name ?? defaultName )}
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={(
            <Typography data-cy="user-name" className={classes.primaryText}>{name}</Typography>)}
          secondary={
            <Typography
              data-cy="secondary-text"
              component="span"
              variant="body2"
              color="textPrimary"
              className={classes.secondaryText}
            >
              {secondaryComponent}
            </Typography>
          }
        />
      </ListItem>
    </>
  );
};

export default UserAvatarListItem;
