/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@material-ui/core';
import _ from 'lodash';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBulkImportTableData, saveHeaderToMap, setIsLoading, setShowTable, setTableData } from '../../../../state/ducks/bulkImport/actions';
import { getBulkImport, getShowTable, getTableData } from '../../../../state/ducks/bulkImport/selectors';
import { BulkImport } from '../../../../state/ducks/bulkImport/types';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
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
  const [isInitialized, setIsInitialized] = useState(false);

  const uploadFileDataAction = useActionCreator(saveHeaderToMap);

  const asyncHeadersToMap = useAsync({
    onSuccess: () => {
      handleSourceTarget();
    },
  });

  const handleSourceTarget = () => {
    dispatch(setShowTable(true));
  };

  const handleBackTable = () => {
    dispatch(setShowTable(false));
  };

  const checkIfIsTable = () => {
    if (!showTable && !_.isEmpty(bulkImport?.mappedHeaders)) {
      handleSourceTarget();
      return true;
    }

    return false;
  };

  const init = () => {
    if (bulkImport?.id) {
      // Check conditions under which to handle source and target.
      const validation = checkIfIsTable();
      // before it starts checking the table data we clean it up to be sure the data is new
      dispatch(setTableData([]));

      if (validation) {
        dispatch(setIsLoading(true));
        // If the user already have data saved, get the data, if not just bring all again
        if (bulkImport?.dataId) {
          dispatch(getBulkImportTableData(bulkImport.id));
        } else {
          asyncHeadersToMap.start(uploadFileDataAction, { headers: bulkImport?.mappedHeaders, bulkImportId: bulkImport.id }, asyncHeadersToMap);
        }
      }
    }
    setIsInitialized(true);
  };

  const checkStatus = () => {
    // Check if there is data to process and that the check hasn't been performed yet.
    if (TableData && TableData.length > 0 && !alreadyCheckValues.current) {
      alreadyCheckValues.current = true; // Mark as checked to prevent duplicate processing.

      // Check conditions under which to handle source and target.
      checkIfIsTable();
    }
  };

  useEffect(
    init
    , []);

  useEffect(
    checkStatus
    , [TableData]);

  if (!isInitialized) {
    return null;
  }

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
