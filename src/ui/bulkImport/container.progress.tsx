import { Box, CircularProgress } from '@material-ui/core';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getBulkImports, resetSteps, setIsLoadingMain } from '../../state/ducks/bulkImport/actions';
import { getIsLoadingMain } from '../../state/ducks/bulkImport/selectors';
import { BULK_IMPORT_URL } from '../constants/urls';
import AuditHistory from './components/Audit';
import Header from './components/Header';
import ImportLog from './components/ImportLog';
import ImportProgress from './components/ImportProgress';
import useStyles from './styles';

interface BulkImportContainerProps extends RouteComponentProps {}

const BulkImportContainer: React.FunctionComponent<BulkImportContainerProps> = ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isLoading = useSelector(getIsLoadingMain);
  const firstLoad = useRef(false);
  const showLoadingComponent = !firstLoad.current && isLoading;
  const [openHistoryPanel, setHistoryPanel] = React.useState<boolean>(false);

  const onHistoryPanelClick = () => { setHistoryPanel(!openHistoryPanel); };

  const fetchBulkImportData = useCallback(() => {
    dispatch(setIsLoadingMain(true));
    dispatch(getBulkImports());
    dispatch(resetSteps());
  }, [dispatch]);

  const onNewImport = () => {
    history.push(BULK_IMPORT_URL);
  };

  useEffect(() => {
    fetchBulkImportData();
  }, [fetchBulkImportData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isLoading) {
        firstLoad.current = true;
        fetchBulkImportData();
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchBulkImportData, isLoading]);

  return (
    <Box className={classes.root}>
      {showLoadingComponent && <Box className={classes.loadingContainer}>
        <CircularProgress color="primary" size={24} className={classes.loading} />
      </Box>}
      <Header onNewImport={onNewImport} onHistory={onHistoryPanelClick} />
      <Box className={classes.importContainer}>
        <ImportProgress />
        <ImportLog />
      </Box>
      {openHistoryPanel
        && <AuditHistory
          openHistoryPanel={openHistoryPanel}
          closeHistoryPanel={onHistoryPanelClick}
        />
      }
    </Box>
  );
};

export default withRouter(BulkImportContainer);
