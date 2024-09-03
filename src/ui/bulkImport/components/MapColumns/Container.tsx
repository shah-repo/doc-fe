/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@material-ui/core';
import _ from 'lodash';
import React, { ReactNode, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBulkImportTableData, setShowTable, setTableData } from '../../../../state/ducks/bulkImport/actions';
import { getBulkImport, getShowTable, getTableData } from '../../../../state/ducks/bulkImport/selectors';
import { BulkImport } from '../../../../state/ducks/bulkImport/types';
import CheckValuesTable from './CheckValuesTable';
import SourceTarget from './SourceTarget';
import useStyles from './styles';

interface MapColumnsProps {
  children?: ReactNode
  handleNext: () => void
  handleCancel: () => void
}

const MapColumns: React.FC<MapColumnsProps> = ({ children, handleNext, handleCancel }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const showTable = useSelector(getShowTable);
  const bulkImport = useSelector(getBulkImport);
  const TableData = useSelector(getTableData);
  const alreadyCheckValues = useRef<boolean>(false);

  const handleSourceTarget = () => {
    dispatch(setShowTable(true));
  };

  const handleBackTable = () => {
    dispatch(setShowTable(false));
  };

  const init = () => {
    if (!showTable) {
      // before it starts checking the table data we clean it up to be sure the data is new
      dispatch(setTableData([]));

      if (bulkImport?.id) {
        dispatch(getBulkImportTableData(bulkImport.id));
      }
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

  useEffect(
    init
    , []);

  useEffect(
    checkStatus
    , [TableData]);

  if (showTable) {
    return (
      <CheckValuesTable handleNext={handleNext} handleBack={handleBackTable} handleCancel={handleCancel} bulkImport={bulkImport as BulkImport} />
    );
  }

  return (
    <SourceTarget handleNext={handleSourceTarget} bulkImport={bulkImport as BulkImport}>
      <Box className={classes.actionContainer}>
        {children}
      </Box>
    </SourceTarget>
  );
};

export default MapColumns;
