import { Avatar, Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { Nullable } from '../../../../../../state/ducks/common/types';
import Colors from '../../../../../layout/theme/utils/colors';
import { getInitalsFromName } from '../../../../icons/avatar/helpers';

const styles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: ({ initialColor }) => ({
      width: 35,
      height: 35,
      borderRadius: '50%',
      fontSize: 14,
      color: Colors.white,
      background: `${initialColor}`,
      fontWeight: 600,
      letterSpacing: 0,
    }),
  })
);

interface Props {
  avatar: Nullable<string>;
  initialColor: string;
  name: string;
}

const UserCard: React.FunctionComponent<Props> = ({ avatar, initialColor, name }) => {
  const classes = styles({ initialColor });
  return (
    <>
      {avatar ?
        <Avatar className={classes.avatar} alt={name} src={avatar} /> :
        <Avatar className={classes.avatar} data-cy="header-userInitials">
          <Box letterSpacing={0} style={{ textTransform: 'uppercase' }}>{getInitalsFromName(name)}</Box>
        </Avatar>
      }
    </>
  );
};

export default UserCard;
