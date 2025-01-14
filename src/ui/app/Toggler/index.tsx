import { FormControlLabel } from '@material-ui/core';
import React from 'react';
import { Switch } from '../../components/forms/fields-next';
import useStyles from './styles';

interface Props {
  className: string
  isChecked: boolean
  name?: string
  onChange: () => void
}

const Toggler: React.FC<Props> = ({
  name,
  className,
  children,
  isChecked,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      className={className}
      classes={{
        label: classes.label,
      }}
      control={
        <Switch
          name={name}
          checked={isChecked}
          onChange={onChange}
          color="secondary"
        />
      }
      label={children}
    />
  );
};

export default Toggler;
