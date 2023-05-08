import React from 'react';
import cx from 'classnames';
import useStyles from './styles';
import { translate } from '../../../../../../../common/intl';

const Status: React.FC<{ value: boolean }> = (props) => {
  const { value } = props;

  const classes = useStyles();

  return (
    <div className={classes.status}>
      <div className={cx(classes.circle, { [classes.circleActive]: value })} />
      {translate(value ? 'common.active' : 'common.inactive')}
    </div>
  );
};

export default Status;
