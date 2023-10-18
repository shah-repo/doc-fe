import { FormControlLabel, SwitchProps, makeStyles } from '@material-ui/core';
import React from 'react';
import { Switch } from '../../../components/forms/fields-next';

interface Props extends SwitchProps {
  label: string
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: 0,
    padding: 0,
    justifyContent: 'space-between',
    gap: theme.spacing(1.25, 1.25),
  },
}));

const SwitchControl: React.FC<Props> = ({
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
