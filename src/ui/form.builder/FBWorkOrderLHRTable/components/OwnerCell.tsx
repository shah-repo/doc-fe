import { Avatar, Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { Employee } from '../../../../state/ducks/company/types';
import { getInitalsFromName } from '../../../components/icons/avatar/helpers';
import OverflowTooltip from '../../../components/OverflowTooltip';
import Colors from '../../../layout/theme/utils/colors';
import { Mode, MODE_FIELD } from '../constants';
import styles from '../styles';
import { CustomTemplateProps, EditableLHRTableItem } from '../types';

export const OwnerCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const classes = styles();
  const { values } = useFormikContext<EditableLHRTableItem>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const ownerDetails = (isAddMode ? values[field] ?? dataItem[field] : dataItem[field]) as Employee;

  let user;
  if (ownerDetails) {
    user = ownerDetails.user;
  }

  const handleClick = () => {
    onClick?.({ dataItem });
  };

  return (
    <OverflowTooltip
      title={user?.name}
      onClick={handleClick}
      placement="top"
      interactive
      arrow
      className={classes.owner}
    >
      { user && <Avatar
        className={classes.avatar}
        alt={user.name}
        src={user.avatar ?? ''}
        style={user.avatar ? {} : { background: user.initialColor, color: Colors.white }}
      >
        {!user?.avatar && getInitalsFromName(user?.name)}
      </Avatar> }
      <Typography
        component="span"
        variant="body2"
        color="textPrimary"
        data-cy="Selected-Groups"
        className={classes.userName}
      >
        {user?.name}
      </Typography>
    </OverflowTooltip>
  );
};
