import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import Text from '../../../../components/Text';
import useStyles from './Redline.banner.styles';

const RedlineBanner: React.FunctionComponent = () => {
  const redlineActive = useSelector(companySelectors.getRedlineActive);
  const dispatch = useDispatch();
  const classes = useStyles();

  // remove banner on unmount
  useEffect(() => () => {
    dispatch(companyActions.redlineConfig(false));
  }, [dispatch]);

  if (!redlineActive) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Text translation="common.redline.message" />
    </Box>
  );
};

export default RedlineBanner;
