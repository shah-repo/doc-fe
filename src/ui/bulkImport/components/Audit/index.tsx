import { Box, CircularProgress, Drawer, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { flatten, map, slice } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { intl } from '../../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../../common/utils/date';
import { bkStatusTextMap } from '../../../../state/ducks/bulkImport/constants';
import { getBulkImports, getBulkImportsMap } from '../../../../state/ducks/bulkImport/selectors';
import { BkStatus, LogEntry } from '../../../../state/ducks/bulkImport/types';
import { companySelectors } from '../../../../state/ducks/company';
import { AuditDetailsProps } from '../../../../state/ducks/userManagement/types';
import Default from '../../../components/common/audit.history/Cards/Default';
import LoadMoreButton from '../../../components/common/load.more.button/LoadMoreButton';
import Text from '../../../components/Text';
import Colors from '../../../layout/theme/utils/colors';
import styles from './styles';

const PER_PAGE = 30;

const fieldTypeConditions = {
  processType: null, // No type requirement
  jobId: null, // No type requirement
  documentRevisionId: null, // No type requirement
  xlsx: 'ARRAY_NEW',
  originalHeaders: 'OBJECT_EDITED',
  dataId: 'STRING_EDITED',
  attachmentId: 'STRING_EDITED',
  status: 'STRING_EDITED',
  approver: 'STRING_NEW',
};

interface OwnProps {
  openHistoryPanel: boolean
  closeHistoryPanel: (panel: boolean) => void
}

interface MergedLog extends LogEntry {
  jobId: string
  approvalId?: string
}

const AuditHistory: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  const classes = styles();
  const bulkImports = useSelector(getBulkImports);
  const bulkImportsMaps = useSelector(getBulkImportsMap);
  const allEmployees = useSelector(companySelectors.getAllEmployees) || [];
  const [isLoading, setIsLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState({ right: openHistoryPanel });
  const [auditItems, setAuditItems] = useState<AuditDetailsProps[]>([]);
  const [page, setPage] = useState(0);
  const mergedLogsData = useRef<MergedLog[]>([]);

  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);

  const closeDrawer = () => {
    setOpenDrawer({ ...openDrawer, right: false });
    closeHistoryPanel(openDrawer.right);
  };

  const filterAndSortLogs = (logs: MergedLog[]): MergedLog[] => {
    const oldestXlsxLogs: Record<string, MergedLog> = {};

    const processedLogs = logs.filter((log) => {
      const requiredType = fieldTypeConditions[log.fieldPath];

      // If the fieldPath doesn't exist in fieldTypeConditions, skip this log
      if (!(log.fieldPath in fieldTypeConditions)) return false;

      // If there's a specific type requirement, check if the log type matches
      if (requiredType && log.type !== requiredType) return false;

      // filter specific types
      if (log?.approvalId && log?.type === 'STRING_EDITED' && log?.fieldPath === 'status') return false;
      if (log?.fieldPath === 'documentRevisionId') return false;

      // Handle `xlsx` field logs by keeping only the oldest log per unique fileId (Because logs give a lot without upload a file, we use only the oldest one per file id)
      if (log.fieldPath === 'xlsx' && log.type === 'ARRAY_NEW') {
        try {
          const xlsxData = JSON.parse(log.nextValue as string);
          const fileId = xlsxData?.fileId;

          // Continue only if fileId exists
          if (fileId) {
            // Store the log if it is the first log for this fileId or if it's older than the stored log
            if (
              !oldestXlsxLogs[fileId]
              || (log.timestamp && oldestXlsxLogs[fileId].timestamp && new Date(log.timestamp).getTime() < new Date(oldestXlsxLogs[fileId].timestamp).getTime())
            ) {
              oldestXlsxLogs[fileId] = log; // Update the oldest log for this fileId
            }
          }
        } catch (error) {
          console.error('Failed to parse xlsx log data:', error);
          return false; // Skip invalid entries
        }

        return false;
      }

      // If there's no type requirement, or if type matches, include the log
      return true;
    });

    // Add the upload data values
    const filteredLogs = [...processedLogs, ...Object.values(oldestXlsxLogs)];

    // sort the logs to have the order per timestamp
    return filteredLogs.sort((a: MergedLog, b: MergedLog) => {
      const dateA = new Date(a.timestamp ?? 0);
      const dateB = new Date(b.timestamp ?? 0);
      return dateB.getTime() - dateA.getTime();
    });
  };

  // Merges all logs from each bulkImport and sorts by timestamp (most recent first)
  const mergeLogs = (bulkImports): MergedLog[] => {
  // Merge all logs from each bulkImport
    const mergedLogs: MergedLog[] = flatten(bulkImports.map((importItem) => {
    // Extract logs from the main logs array
      const mainLogs = importItem.logs.map((log) => ({
        ...log,
        jobId: importItem.jobId,
      }));

      // Extract logs from the documentRevision approvals
      const approvalLogs = importItem?.documentRevision?.approvals
        ? flatten(
          importItem.documentRevision.approvals.map((approval) =>
            approval.auditLogs.map((log) => ({
              ...log,
              jobId: importItem.jobId,
              approverName: approval.approverName, // Add additional info if needed
              approverEmail: approval.approverEmail,
            })),
          ),
        )
        : [];

      // Combine main logs and approval logs
      return [...mainLogs, ...approvalLogs];
    }));

    return mergedLogs;
  };

  const getDescription = (log: MergedLog): Array<{ primaryText: string, secondaryText: string }> => {
    const currentBulkImport = bulkImportsMaps[log.jobId];
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
          secondaryText = matchedExcelFile
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
          secondaryText = matchedZipFile
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
      const ownerDetails = getUserDetails(log.ownerId) || {
        user: {
          name: intl.formatMessage({ id: 'common.server.automation' }),
          email: log.ownerEmail,
        },
      };

      const descriptions = [{ primaryText: 'Job ID:', secondaryText: `${log.jobId}` }, ...getDescription(log)];

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
    setIsLoading(true);
    const start = page * PER_PAGE;
    const end = start + PER_PAGE;

    // Get merged and sorted logs
    mergedLogsData.current = mergeLogs(bulkImports);

    // Filter logs based on allowed fieldPaths and specific types
    const filteredLogs = filterAndSortLogs(mergedLogsData.current);

    // Paginate the logs by slicing the merged and sorted logs
    const nextLogs = slice(processLogs(filteredLogs), start, end);

    // Append the new logs to the Items array
    setAuditItems((prevItems) => [...prevItems, ...nextLogs]);
    setPage((prevPage) => prevPage + 1);
    setIsLoading(false);
  };

  useEffect(() => {
    // On initial load, fetch the first page of audit records
    fetchAuditRecords();
  }, []);

  const renderAuditRecords = () => (
    <>
      <div data-cy="external-container" className={classes.externalContainer}>
        <div className={classes.titleOuterContainer}>
          <div className={classes.titleContainer}>
            <Text translation="document.revision.history" />
          </div>
          <div className={classes.iconContainer} >
            <IconButton
              style={{ width: '23px' }}
              color="default"
              onClick={closeDrawer}
              aria-label="Close"
              disableFocusRipple
              disableRipple
              disableTouchRipple
              data-cy="um-close-history-panel"
            >
              <CloseIcon style={{ color: Colors.gray }} />
            </IconButton>
          </div>
        </div>
      </div>
      {isLoading && <Box position="absolute" top="50%" left="40%"><CircularProgress /></Box>}
      <Box className={classes.listItemContainer}>
        {map(auditItems, (auditDetails, groupKey) => (
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
        <Box className={classes.listActions}>
          <LoadMoreButton
            disable={isLoading || auditItems.length >= mergedLogsData.current.length}
            onLoadMore={fetchAuditRecords}
            id="historyLoadMore"
            className={classes.loadMore}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default AuditHistory;
