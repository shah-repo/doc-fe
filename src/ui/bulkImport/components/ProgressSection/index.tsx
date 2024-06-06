import {
  Box,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../state/ducks/auth';
import { getBulkImportsGroupByProcess } from '../../../../state/ducks/bulkImport/selectors';
import { BulkImportCustom } from '../../../../state/ducks/bulkImport/types';
import ProgressItem from './ProgressItem';
import useStyles from './styles';

const ProgressSection: React.FC = () => {
  const classes = useStyles();
  const bulkImportsGroupByProcess = useSelector(getBulkImportsGroupByProcess);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);

  return (
    <Box>
      <Box>
        {Object.keys(bulkImportsGroupByProcess).map((key: string) => {
          return (
            <Box key={key}>
              <Typography className={classes.progressTitle}>
                <ExpandMoreIcon className={classes.expandIcon} />{key}
              </Typography>
              {bulkImportsGroupByProcess[key]?.map((item: BulkImportCustom, idx: number) => {
                return (
                  <ProgressItem item={item} key={`${key}-${idx}`} valKey={key} idx={idx} currentEmployeeId={currentEmployeeId} />
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProgressSection;
