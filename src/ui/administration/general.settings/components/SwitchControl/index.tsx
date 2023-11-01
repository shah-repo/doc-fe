import { FormControlLabel } from '@material-ui/core';
import React from 'react';
import { Switch } from '../../../../components/forms/fields-next';
import { SwitchControlProps } from '../../types';
import useStyles from './styles';

const SwitchControl: React.FC<SwitchControlProps> = ({
  label,
  ...props
}) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      className={classes.root}
      control={<Switch {...props} />}
      labelPlacement="start"
      label={label}
    />
  );
};

export default SwitchControl;
