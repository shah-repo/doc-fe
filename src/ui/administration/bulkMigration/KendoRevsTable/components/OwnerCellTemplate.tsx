import { ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import UserAvatarListItem from '../../../../documentRevision/Sidebar/common/UserAvatarListItem';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

export const OwnerCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { owner, name } = props.dataItem;

  return (
    <>
      <ListItemText
        primary={(
          <Typography data-cy="user-name" className={classes.revsTablePrimaryText}>{name}</Typography>)}
        secondary={<></>}
      />
      { owner?.user && <UserAvatarListItem
        name={<div>{owner?.user.name}</div>}
        user={owner?.user}
        secondaryComponent={<></>}
      /> }</>
  );
};
