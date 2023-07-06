import { Divider, Grid } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import FBBOMTreeList from './components/treelist';
import useStyles from './components/treelist/styles';

const FBBOM: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container justify="space-between">
        <Grid item className={classes.header}>
          {translate('tabId.bom')}
        </Grid>
      </Grid>
      <Divider />
      <Grid item className={classes.tableContainer}>
        <FBBOMTreeList />
      </Grid>
    </>);
};

export default FBBOM;
