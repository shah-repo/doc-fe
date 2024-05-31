/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@material-ui/core';
import _ from 'lodash';
import React, { ReactNode, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bulkImportActions, bulkImportSelectors } from '../../../../state/ducks/bulkImport';
import { BulkImport } from '../../../../state/ducks/bulkImport/types';
import { NeedHelpButton } from '../ButtonActions';
import CheckValuesTable from './CheckValuesTable';
import SourceTarget from './SourceTarget';
import useStyles from './styles';

interface MapColumnsProps {
  children?: ReactNode
  handleNext: () => void
  handleBack: () => void
}

const MapColumns: React.FC<MapColumnsProps> = ({ children, handleNext, handleBack }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const showTable = useSelector(bulkImportSelectors.getShowTable);
  const bulkImport = useSelector(bulkImportSelectors.getBulkImport);
  const TableData = useSelector(bulkImportSelectors.getTableData);
  const alreadyCheckValues = useRef<boolean>(false);

  const handleSourceTarget = () => {
    dispatch(bulkImportActions.setShowTable(true));
  };

  const init = () => {
    // before it starts checking the table data we clean it up to be sure the data is new
    dispatch(bulkImportActions.setTableData([]));

    if (bulkImport?.id) {
      dispatch(bulkImportActions.getBulkImportTableData(bulkImport.id));
    }
  };

  const checkStatus = () => {
    // Check if there is data to process and that the check hasn't been performed yet.
    if (TableData && TableData.length > 0 && !alreadyCheckValues.current) {
      alreadyCheckValues.current = true; // Mark as checked to prevent duplicate processing.

      // Check conditions under which to handle source and target.
      if (!showTable && !_.isEmpty(bulkImport?.mappedHeaders)) {
        handleSourceTarget();
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    checkStatus();
  }, [TableData]);

  if (showTable) {
    return (
      <CheckValuesTable handleNext={handleNext} handleBack={handleBack} bulkImport={bulkImport as BulkImport} />
    );
  }

  return (
    <SourceTarget handleNext={handleSourceTarget} bulkImport={bulkImport as BulkImport}>
      <Box className={classes.actionContainer}>
        <Box className={classes.needHelpContainer}>
          <NeedHelpButton />
        </Box>
        {children}
      </Box>
    </SourceTarget>
  );
};

export default MapColumns;
