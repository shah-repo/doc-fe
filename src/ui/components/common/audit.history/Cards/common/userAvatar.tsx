import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';
import { Nullable } from '../../../../../../state/ducks/common/types';
import styles from './common.styles';
import UserCard from './UserCard';

interface Props {
  timestamp: string
  userDetails: {
    user: {
      avatar: Nullable<string>
      initialColor: string
      name: string
    }
  }
}

const UserAvatarCard: React.FunctionComponent<Props> = ({ timestamp, userDetails }) => {
  const intl = useIntl();
  const { avatar, initialColor, name } = { ...userDetails.user };
  const updatedName = ['Admin', 'unknown', 'EnlilMail SysAdmin'].includes(name)
    ? intl.formatMessage({ id: 'common.server.automation' })
    : name;
  const classes = styles();
  return (
    <ListItem alignItems="flex-start" disableGutters style={{ padding: 0 }}>
      <ListItemAvatar style={{ minWidth: 43 }}>
        <UserCard avatar={avatar} initialColor={initialColor} name={updatedName} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography className={classes.generalInfo}>{updatedName}</Typography>
        }
        secondary={
          <Typography
            component="span"
            variant="body2"
            color="textPrimary"
            className={classes.secondaryText}
          >
            {timestamp}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default UserAvatarCard;
