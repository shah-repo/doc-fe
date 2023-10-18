import { Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import { Colors } from '../../../layout/theme-next';

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: 16,
    marginBottom: theme.spacing(2.5),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${Colors.stroke}`,
  },
}));

const SettingsPanelSection: React.FC = ({
  children,
}) => {
  const classes = useStyles();

  return (
    <Typography variant="h3" className={classes.root}>{children}</Typography>
  );
};

export default SettingsPanelSection;
