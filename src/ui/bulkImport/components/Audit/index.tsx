import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, CircularProgress, Drawer, IconButton } from '@material-ui/core';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { isEmpty, map, values } from 'lodash';
import qs from 'query-string';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../../common/utils/date';
import apiClient from '../../../../state/apiClient';
import { bkStatusTextMap, BULK_IMPORT_AUDIT_URL } from '../../../../state/ducks/bulkImport/constants';
import { getBulkImportsMap } from '../../../../state/ducks/bulkImport/selectors';
import { BkStatus, BulkImport, BulkImportLogsEntries, LogEntry, LogEntryType } from '../../../../state/ducks/bulkImport/types';
import { ApprovalStatus } from '../../../../state/ducks/common/types';
import { companySelectors } from '../../../../state/ducks/company';
import { DocumentRevisionStatus } from '../../../../state/ducks/documentRevisions/types';
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

  const getLogsStatusStepChange = (
    log: MergedLog,
    currentBulkImport: BulkImport,
    previousValue: string,
    nextValue: string,
  ): {
    secondaryText: string
    stepChange: string
    skip: boolean
  } => {
    let secondaryText;
    let stepChange;
    let skip;

    if (log.type === LogEntryType.STRING_EDITED) {
      if (log.documentRevisionId && previousValue === DocumentRevisionStatus.Draft && nextValue === DocumentRevisionStatus.InReview) {
        // When is document revision and used to be draft and now is on review (Submitted for approval)
        secondaryText = translate('bk.audit-log.submitted.for.approval');
        stepChange = translate('bk.audit-log.step-5-approvals');
      } else if (log.documentRevisionId && previousValue === DocumentRevisionStatus.InReview && nextValue === DocumentRevisionStatus.Released) {
        // When is document revision and used to be in review and now is on released (Approved)
        secondaryText = translate('bk.audit-log.approved');
        stepChange = translate('bk.audit-log.step-5-approvals');
      } else if (log.approvalId && previousValue === ApprovalStatus.Pending && (nextValue === ApprovalStatus.Approved || nextValue === ApprovalStatus.Rejected)) {
        // when is a approval and it would be approved or rejected
        const getApprover = currentBulkImport?.documentRevision?.approvals?.find((approval) => approval.id === log.approvalId);
        if (getApprover) {
          const approverDetails = getUserDetails(getApprover?.approverId as string);
          secondaryText = translate(
            nextValue === ApprovalStatus.Approved ? 'bk.audit-log.approved.by' : 'bk.audit-log.rejected.by',
            { approverName: approverDetails?.user?.name },
          );
          stepChange = translate('bk.audit-log.step-5-approvals');
        } else {
          skip = true;
        }
      } else if (previousValue === ApprovalStatus.Draft && nextValue === ApprovalStatus.Pending && !log.bulkImportId && !log.documentRevisionId) {
        skip = true;
      } else {
        // When bulk import change the status
        const nextStatus = bkStatusTextMap[nextValue as BkStatus] || nextValue;
        secondaryText = translate('bk.audit-log.importing.status', { status: nextStatus });
        stepChange = translate('bk.audit-log.step-6-importing');
      }
    } else if (log.type === LogEntryType.STRING_NEW && previousValue === 'undefined') {
      skip = true;
    }

    return { secondaryText, stepChange, skip };
  };

  const getDescription = (log: MergedLog, currentBulkImport: BulkImport): Array<{ primaryText: string, secondaryText: string }> | null => {
    const previousValue: string = log.previousValue as string;
    const nextValue: string = log.nextValue as string;
    let secondaryText = translate('bk.audit-log.changed.from.to', { previousValue, nextValue });
    let stepChange = '';
    let skip = false;

    switch (log.fieldPath) {
      case BulkImportLogsEntries.PROCESS_TYPE:
        secondaryText = translate('bk.audit-log.process.type.select', { nextValue });
        stepChange = translate('bk.audit-log.step-1-import-details');
        skip = true;
        break;
      case BulkImportLogsEntries.JOB_ID:
        secondaryText = translate('bk.audit-log.job.new.import.started', { processType: currentBulkImport.processType });
        stepChange = translate('bk.audit-log.step-1-import-details');
        break;
      case BulkImportLogsEntries.XLSX:
        if (log.type === LogEntryType.ARRAY_NEW) {
          const xlsxData = JSON.parse(nextValue);
          const matchedExcelFile = currentBulkImport.excelFile && currentBulkImport.excelFile.id === xlsxData.fileId;
          secondaryText = matchedExcelFile && currentBulkImport.excelFile
            ? translate('bk.audit-log.file.uploaded', { fileName: currentBulkImport.excelFile.name, fileType: currentBulkImport.excelFile.type })
            : translate('bk.audit-log.file.uploaded.id', { fileId: xlsxData.fileId });
          stepChange = translate('bk.audit-log.step-2-upload-data');
        }
        break;
      case BulkImportLogsEntries.ORIGINAL_HEADERS:
        if (log?.type === LogEntryType.OBJECT_EDITED) {
          secondaryText = translate('bk.audit-log.select.headers');
          stepChange = translate('bk.audit-log.step-3-map-columns');
        }
        break;
      case BulkImportLogsEntries.DATA_ID:
        if (log.type === LogEntryType.STRING_EDITED) {
          secondaryText = translate('bk.audit-log.edit.table.data');
          stepChange = translate('bk.audit-log.step-3-edit-table-data');
        }
        break;
      case BulkImportLogsEntries.ATTACHMENT_ID:
        if (log.type === LogEntryType.STRING_EDITED) {
          const matchedZipFile = currentBulkImport.zipFile && currentBulkImport.zipFile.id === nextValue;
          secondaryText = matchedZipFile && currentBulkImport.zipFile
            ? translate('bk.audit-log.attachment.uploaded', { fileName: currentBulkImport.zipFile.name, fileType: currentBulkImport.zipFile.type })
            : translate('bk.audit-log.attachment.uploaded.id', { fileId: nextValue });
          stepChange = translate('bk.audit-log.step-4-upload-attachment');
        }
        break;
      case BulkImportLogsEntries.STATUS: {
        const statusData = getLogsStatusStepChange(
          log,
          currentBulkImport,
          previousValue,
          nextValue,
        );

        secondaryText = statusData.secondaryText;
        stepChange = statusData.stepChange;
        skip = statusData.skip;
        break;
      }
      case BulkImportLogsEntries.APPROVER:
        if (log.type === LogEntryType.STRING_NEW) {
          const approverDetails = getUserDetails(nextValue);
          secondaryText = approverDetails
            ? translate('bk.audit-log.approver.assigned', { approverName: approverDetails?.user?.name })
            : translate('bk.audit-log.approver.assigned.id', { approverId: nextValue });
          stepChange = translate('bk.audit-log.step-5-approvals');
        }
        break;
    }

    if (skip) {
      return null;
    }

    return [
      { primaryText: translate('bk.audit-log.type-title'), secondaryText: stepChange },
      { primaryText: translate('bk.audit-log.update-title'), secondaryText },
    ];
  };

  const processLogs = (logs: MergedLog[]): AuditDetailsProps[] => {
    return logs.map((log) => {
      let currentBulkImport: BulkImport = bulkImportsMaps.bulkImportIds[log.jobId ?? log.bulkImportId];
      if (!currentBulkImport) {
        if (log.documentRevisionId) {
          currentBulkImport = bulkImportsMaps.documentRevisionIds[log.documentRevisionId];
        } else if (log.approvalId) {
          currentBulkImport = bulkImportsMaps.approvalIds[log.approvalId];
        }
      }
      const ownerDetails = getUserDetails(log.ownerId) ?? {
        user: {
          name: intl.formatMessage({ id: 'common.server.automation' }),
          email: log.ownerEmail,
        },
      };

      const descriptionData = getDescription(log, currentBulkImport);

      if (!descriptionData) {
        return null;
      }

      const descriptions = [{ primaryText: 'Job ID:', secondaryText: `${currentBulkImport?.jobId}` }, ...descriptionData];

      return {
        descriptions,
        employeeDetails: {},
        groupId: log.groupId,
        ownerDetails,
        timestamp: `${getFormattedDateString(log.timestamp, MomentFormats.BriefDateTime)}`,
      } as AuditDetailsProps;
    }).filter(data => data !== null) as AuditDetailsProps[];
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
