import { Radio as MuiRadio, RadioProps } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { withThemeNext } from '../../../../layout/theme-next';
import useStyles from './Radio.styles';

const Radio: React.FC<RadioProps> = React.forwardRef((props, ref) => {
  const classes = useStyles();

  return (
    <MuiRadio
      {...props}
      checkedIcon={<span className={cx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      ref={ref}
    />
  );
});

export default withThemeNext(Radio);
