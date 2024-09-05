import { Box, CircularProgress, Drawer, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { flatten, map, slice } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { intl } from '../../../../common/intl';
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
  const [Items, setItems] = useState<AuditDetailsProps[]>([]);
  const [page, setPage] = useState(0);
  const mergedLogsData = useRef<MergedLog[]>([]);

  const getUserDetails = (userId: string) => allEmployees.find((obj) => obj.id === userId);

  const closeDrawer = () => {
    setOpenDrawer({ ...openDrawer, right: false });
    closeHistoryPanel(openDrawer.right);
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

  const processLogs = (logs: MergedLog[]): AuditDetailsProps[] => {
    return logs.map((log) => {
      const ownerDetails = getUserDetails(log.ownerId) || {
        user: {
          name: intl.formatMessage({ id: 'common.server.automation' }),
          email: log.ownerEmail,
        },
      };

      const descriptions = [
        {
          primaryText: `${log.jobId}`,
          secondaryText: `Field: ${log.fieldPath} changed from ${log.previousValue} to ${log.nextValue}`,
        },
      ];

      return {
        descriptions,
        employeeDetails: {},
        groupId: log.groupId,
        ownerDetails,
        timestamp: log.timestamp,
      } as AuditDetailsProps;
    });
  };

  const fetchAuditRecords = () => {
    setIsLoading(true);
    const start = page * PER_PAGE;
    const end = start + PER_PAGE;

    // Get merged and sorted logs
    mergedLogsData.current = mergeAndSortLogs(bulkImports);

    // Paginate the logs by slicing the merged and sorted logs
    const nextLogs = slice(processLogs(mergedLogsData.current), start, end);

    // Append the new logs to the Items array
    setItems((prevItems) => [...prevItems, ...nextLogs]);
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
        <Box className={classes.listActions}>
          <LoadMoreButton
            disable={isLoading || Items.length >= mergedLogsData.current.length}
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
