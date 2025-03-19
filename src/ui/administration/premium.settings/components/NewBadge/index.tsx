import { Badge } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { withThemeNext } from '../../../../layout/theme-next';
import useStyles from './styles';

interface NewBadgeProps {
  label?: string
}

const NewBadge: React.FC<NewBadgeProps> = ({
  label = translate('administration.new'),
}) => {
  const classes = useStyles();

  return (
    <Badge className={classes.container}>
      {label}
    </Badge>
  );
};

export default withThemeNext(NewBadge);
