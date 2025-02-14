import { FormControlLabel } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { Switch } from '../../../../components/forms/fields-next';
import { SwitchControlProps } from '../../types';
import useStyles from './styles';

const SwitchControl: React.FC<SwitchControlProps> = ({
  label,
  labelProps,
  ...props
}) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      {...labelProps}
      className={cx(classes.root, labelProps?.className)}
      control={<Switch {...props} />}
      labelPlacement="start"
      label={label}
    />
  );
};

export default SwitchControl;
