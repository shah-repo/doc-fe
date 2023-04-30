import React from 'react';
import cx from 'classnames';
import useStyles from './styles';

const Status: React.FC<{ value: boolean }> = (props) => {
  const { value } = props;

  const classes = useStyles();

  return (
    <div className={classes.status}>
      <div className={cx(classes.circle, { [classes.circleActive]: value })} />
      {value ? 'Active' : 'Inactive'}
    </div>
  );
};

export default Status;
