import { Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './styles';

const SettingsPanelSection: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <Typography variant="h3" className={classes.root}>{children}</Typography>
  );
};

// TODO remove next line or whole component after UX requirements refinement
// ts-unused-exports:disable-next-line
export default SettingsPanelSection;
