import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, CircularProgress, Drawer, IconButton } from '@material-ui/core';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { isEmpty, map, values } from 'lodash';
import qs from 'query-string';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getFormattedDateString, MomentFormats } from '../../../../common/utils/date';
import apiClient from '../../../../state/apiClient';
import { bkStatusTextMap, BULK_IMPORT_AUDIT_URL } from '../../../../state/ducks/bulkImport/constants';
import { getBulkImportsMap } from '../../../../state/ducks/bulkImport/selectors';
import { BkStatus, BulkImport, LogEntry } from '../../../../state/ducks/bulkImport/types';
import { companySelectors } from '../../../../state/ducks/company';
import { UM_AUDIT_HISTORY_INITIAL_OFFSET, UM_AUDIT_HISTORY_LIMIT } from '../../../../state/ducks/userManagement/constants';
import { AuditDetailsProps } from '../../../../state/ducks/userManagement/types';
import { store } from '../../../../state/store';
import Default from '../../../components/common/audit.history/Cards/Default';
import LoadMoreButton from '../../../components/common/load.more.button/LoadMoreButton';
import Text from '../../../components/Text';
import styles from './styles';

let call: CancelTokenSource;

interface AuditHistoryProps {
  openHistoryPanel: boolean
  closeHistoryPanel: (panel: boolean) => void
}

interface MergedLog extends LogEntry {
  bulkImport: BulkImport
  bulkImportId: string
  approvalId: string
  jobId: string
}

const AuditHistory: React.FunctionComponent<AuditHistoryProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  const intl = useIntl();
  const limit = UM_AUDIT_HISTORY_LIMIT;
  const classes = styles();
  const bulkImportsMaps = useSelector(getBulkImportsMap);
  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openDrawer, setOpenDrawer] = React.useState({ right: openHistoryPanel });
  const [Items, setItems] = React.useState<AuditDetailsProps[]>([]);
  const [page, setPage] = useState(UM_AUDIT_HISTORY_INITIAL_OFFSET);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [overallLimit, setOverallLimit] = React.useState(0);
  const [dataTotal, setDataTotal] = React.useState(0);

  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);

  const closeDrawer = () => {
    setOpenDrawer({ ...openDrawer, right: false });
    closeHistoryPanel(openDrawer.right);
  };

  React.useEffect(() => {
    fetchAuditRecords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDescription = (log: MergedLog, currentBulkImport: BulkImport): Array<{ primaryText: string, secondaryText: string }> => {
    let secondaryText = `Changed from ${log.previousValue} to ${log.nextValue}`; // Default secondary text
    let stepChange = '';

    switch (log.fieldPath) {
      case 'processType':
        secondaryText = `Select process type: ${log.nextValue}`;
        stepChange = 'Step 1 Import Details';
        break;
      case 'jobId':
        secondaryText = `Created the bulk import job id: ${log.nextValue}`;
        stepChange = 'Bulk Import Created';
        break;
      case 'xlsx':
        if (log.type === 'ARRAY_NEW') {
          const xlsxData = JSON.parse(log?.nextValue as string);
          const matchedExcelFile = currentBulkImport.excelFile && currentBulkImport.excelFile.id === xlsxData.fileId;
          secondaryText = matchedExcelFile && currentBulkImport.excelFile
            ? `Uploaded Excel file: ${currentBulkImport.excelFile.name}.${currentBulkImport.excelFile.type}`
            : `Upload a old xlsx file, field id: ${xlsxData.fileId}`;
          stepChange = 'Step 2 Upload Data';
        }
        break;
      case 'originalHeaders':
        if (log?.type === 'OBJECT_EDITED') {
          secondaryText = 'Select the headers';
          stepChange = 'Step 3 Map Columns';
        }
        break;
      case 'dataId':
        if (log.type === 'STRING_EDITED') {
          secondaryText = 'Edit table data';
          stepChange = 'Step 3 Edit table data';
        }
        break;
      case 'attachmentId':
        if (log.type === 'STRING_EDITED') {
          const matchedZipFile = currentBulkImport.zipFile && currentBulkImport.zipFile.id === log.nextValue;
          secondaryText = matchedZipFile && currentBulkImport.zipFile
            ? `Uploaded zip file: ${currentBulkImport.zipFile.name}.${currentBulkImport.zipFile.type}`
            : `Upload zip file id: ${log.nextValue}`;
          stepChange = 'Step 4 Upload Attachment';
        }
        break;
      case 'status':
        if (log.type === 'STRING_EDITED') {
          const previousStatus = bkStatusTextMap[log.previousValue as BkStatus] || log.previousValue;
          const nextStatus = bkStatusTextMap[log.nextValue as BkStatus] || log.nextValue;
          secondaryText = `Bulk import status changed from ${previousStatus} to ${nextStatus}`;
          stepChange = 'Bulk import update';
        }
        break;
      case 'approver':
        if (log.type === 'STRING_NEW') {
          const approverDetails = getUserDetails(log.nextValue as string);
          secondaryText = approverDetails
            ? `Assigned approver: ${approverDetails?.user?.name}`
            : `Assigned approver ID: ${log.nextValue}`;
          stepChange = 'Approver Assigned';
        }
        break;
    }

    return [
      { primaryText: 'Type: ', secondaryText: stepChange },
      { primaryText: 'Update: ', secondaryText },
    ];
  };

  const processLogs = (logs: MergedLog[]): AuditDetailsProps[] => {
    return logs.map((log) => {
      const currentBulkImport: BulkImport = bulkImportsMaps[log.jobId ?? log.bulkImportId];
      const ownerDetails = getUserDetails(log.ownerId) ?? {
        user: {
          name: intl.formatMessage({ id: 'common.server.automation' }),
          email: log.ownerEmail,
        },
      };

      const descriptions = [{ primaryText: 'Job ID:', secondaryText: `${currentBulkImport.jobId}` }, ...getDescription(log, currentBulkImport)];

      return {
        descriptions,
        employeeDetails: {},
        groupId: log.groupId,
        ownerDetails,
        timestamp: `${getFormattedDateString(log.timestamp, MomentFormats.BriefDateTime)}`,
      } as AuditDetailsProps;
    });
  };

  const fetchAuditRecords = () => {
     call?.cancel();
     call = axios.CancelToken.source();
     setIsLoading(true);
     setLoadMore(true);
     setErrorMessage('');
     setOverallLimit(overallLimit + UM_AUDIT_HISTORY_LIMIT);
     const requestConfig: AxiosRequestConfig = {
       method: 'get',
       url: BULK_IMPORT_AUDIT_URL,
       params: { offset: page, limit },
       paramsSerializer: (params) => qs.stringify(params),
       headers: {
         Authorization: `bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`,
       },
       cancelToken: call.token,
     };
     apiClient
       .request(requestConfig)
       .then((resp) => resp)
       .then(({ data }: { data: {results: MergedLog[], total: number }}) => {
         const results = processLogs(data.results || []);
         setItems((prevState: AuditDetailsProps[]) => [
           ...prevState,
           ...values(results),
         ] as AuditDetailsProps[]);
         setPage((prevPageNumber) => prevPageNumber + limit);
         setIsLoading(false);
         setShowLoadMoreButton(true);
         setLoadMore(page + limit < data.total);
         setDataTotal(data.total);
       })
       .catch((exception) => {
         setIsLoading(false);
         if (axios.isCancel(exception)) {
           return;
         }
         if (exception?.response?.status === 504) {
           setErrorMessage(intl.formatMessage({ id: 'api.error.gateway.timeout' }));
         } else {
           setErrorMessage(intl.formatMessage({ id: 'errors.somethingWentWrong' }));
         }
       });
  };

  const renderAuditRecords = () => (
    <>
      <div data-cy="external-container" className={classes.externalContainer}>
        <div className={classes.titleOuterContainer}>
          <div className={classes.titleContainer}>
            <Text translation="document.revision.history" />
          </div>
          <div className={classes.iconContainer} >
            <IconButton
              color="default"
              onClick={closeDrawer}
              aria-label="Close"
              disableFocusRipple
              disableRipple
              disableTouchRipple
              data-cy="um-close-history-panel"
            >
              <FontAwesomeIcon icon={regular('xmark')} className={classes.closeIcon} />
            </IconButton>
          </div>
        </div>
      </div>
      {isLoading && <Box position="absolute" top="50%" left="40%"><CircularProgress /></Box>}
      <Box className={classes.listItemContainer}>
        {map(Items, (auditDetails, groupKey) => (
          <Box key={groupKey} style={{ padding: 0 }}>
            <Default auditDetails={auditDetails} />
          </Box>
        ))}
      </Box>
    </>
  );

  return (
    <Drawer anchor="right" open={openDrawer.right} onClose={closeDrawer}>
      <Box className={classes.root}>
        {renderAuditRecords()}
        {!isEmpty(errorMessage) && <div className={classes.errorMessage}>{errorMessage}</div>}
        {showLoadMoreButton && (
          <Box className={classes.listActions}>
            <LoadMoreButton
              disable={isLoading || !loadMore || overallLimit >= dataTotal}
              onLoadMore={fetchAuditRecords}
              id="historyLoadMore"
              className={classes.loadMore}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default AuditHistory;
