import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import Text from '../components/Text';
import Colors from '../layout/theme/utils/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    color: Colors.red,
    padding: theme.spacing(2, 1.5),
  },
}));

const NoPendingActions: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Text
        translation="dashboard.noPendingActions"
        dataCy="dashboard.noPendingActions"
      />
    </Box>
  );
};

export default NoPendingActions;
