import {
  Box,
  CircularProgress,
} from '@material-ui/core';
import React from 'react';
import StepTitle from '../StepTitle';
import useStyles from './styles';

const ImportingProgress = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <StepTitle title="bulkImport.importingProgress.step5Title" subTitle="bulkImport.importingProgress.step5SubTitle" />
      <CircularProgress color="primary" size={70} className={classes.loading} />
    </Box>
  );
};

export default ImportingProgress;
