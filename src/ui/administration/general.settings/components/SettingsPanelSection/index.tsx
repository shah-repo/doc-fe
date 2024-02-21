import { Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';

const SettingsPanelSection: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Typography variant="h3" className={classes.root}>{children}</Typography>
  );
};

export default SettingsPanelSection;
