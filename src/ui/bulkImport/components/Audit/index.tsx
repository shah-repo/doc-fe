import { Box, CircularProgress, Drawer, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { flatten, map, slice } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { intl } from '../../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../../common/utils/date';
import { getBulkImports } from '../../../../state/ducks/bulkImport/selectors';
import { LogEntry } from '../../../../state/ducks/bulkImport/types';
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
};

interface OwnProps {
  openHistoryPanel: boolean
  closeHistoryPanel: (panel: boolean) => void
}

interface MergedLog extends LogEntry {
  jobId: string
}

const AuditHistory: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  const classes = styles();
  const bulkImports = useSelector(getBulkImports);
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

  const filterLogs = (logs: MergedLog[]): MergedLog[] => {
    return logs.filter((log) => {
      const requiredType = fieldTypeConditions[log.fieldPath];

      // If the fieldPath doesn't exist in fieldTypeConditions, skip this log
      if (!(log.fieldPath in fieldTypeConditions)) return false;

      // If there's a specific type requirement, check if the log type matches
      if (requiredType && log.type !== requiredType) return false;

      // If there's no type requirement, or if type matches, include the log
      return true;
    });
  };

  // Merges all logs from each bulkImport and sorts by timestamp (most recent first)
  const mergeAndSortLogs = (bulkImports): MergedLog[] => {
    // Merge all logs from each bulkImport
    const mergedLogs: MergedLog[] = flatten(bulkImports.map((importItem) => importItem.logs.map((log) => ({
      ...log,
      jobId: importItem.jobId,
    }))));

    return mergedLogs.sort((a: MergedLog, b: MergedLog) => {
      const dateA = new Date(a.timestamp ?? 0);
      const dateB = new Date(b.timestamp ?? 0);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const getDescription = (log: MergedLog): Array<{ primaryText: string, secondaryText: string }> => {
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
      case 'documentRevisionId':
        secondaryText = `Created a document Revision Id: ${log.nextValue}`;
        stepChange = 'Document Revision Created';
        break;
      case 'xlsx':
        if (log.type === 'ARRAY_NEW') {
          const xlsxData = JSON.parse(log?.nextValue as string);
          secondaryText = `Upload a xlsx file, field id: ${xlsxData.fileId}`;
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
          secondaryText = `Upload zip file id: ${log.nextValue}`;
          stepChange = 'Step 4 Upload Attachment';
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
    mergedLogsData.current = mergeAndSortLogs(bulkImports);

    // Filter logs based on allowed fieldPaths and specific types
    const filteredLogs = filterLogs(mergedLogsData.current);

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
