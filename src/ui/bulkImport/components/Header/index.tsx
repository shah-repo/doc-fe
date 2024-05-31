import { Box, LinearProgress, Typography } from '@material-ui/core';
import { noop } from 'lodash';
import React from 'react';
import Text from '../../../components/Text';
import { Button } from '../../../components/forms/fields-next';
import { withThemeNext } from '../../../layout/theme-next';

import useStyles from './styles';

export interface BulkImportProgressProps {
  isLoading?: boolean
  onHistory?: () => void
  onNewOCR?: () => void
  onNewImport?: () => void
}

const BulkImportProgressPage: React.FC<BulkImportProgressProps> = ({
  isLoading = false,
  onHistory = noop,
  onNewOCR = noop,
  onNewImport = noop,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.header}>
      <Box>
        <Typography
          variant="h1"
          className={classes.title}
        >
          <Text translation="bulkImport.progress.title" />
        </Typography>
        <Typography
          variant="subtitle1"
          className={classes.subtitle}
        >
          <Text translation="bulkImport.progress.subtitle" />
        </Typography>
      </Box>
      <Box className={classes.actions}>
        <Box className={classes.buttons}>
          {/* <Button kind="outlined" onClick={onHistory} data-cy="settings-history" disabled><Text translation="common.history" /></Button> */}
          {/* <Button onClick={onNewOCR} data-cy="settings-save"><Text translation="bulkImport.progress.header.newOCR" /></Button> */}
          <Button onClick={onNewImport} data-cy="settings-save"><Text translation="bulkImport.progress.header.newImport" /></Button>
        </Box>
      </Box>
      {isLoading && <LinearProgress className={classes.progress} data-cy="saving-progress-bar" />}
    </Box>
  );
};

export default withThemeNext(BulkImportProgressPage);
