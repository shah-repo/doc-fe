import { AppBar, Box, Drawer, LinearProgress, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { MomentFormats } from '../../../../../common/utils/date';
import { User } from '../../../../../state/ducks/common/types';
import { companyActions } from '../../../../../state/ducks/company';
import DateTime from '../../../../components/DateTime';
import { Button } from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import UserAvatarListItem from '../../../../documentRevision/Sidebar/common/UserAvatarListItem';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { withThemeNext } from '../../../../layout/theme-next';
import { AUDIT_CHANGE_TYPE, CompanySettingsChangeLog } from '../../types';
import useStyles from './styles';

interface SettingsHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsHistoryDrawer: React.FC<SettingsHistoryDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [auditLogsMap, setAuditLogsMap] = useState<{[key: string]: CompanySettingsChangeLog[]}>({});
  const handleAuditLogs = (logs: CompanySettingsChangeLog[] | undefined) => {
    const logsMap: {[key: string]: CompanySettingsChangeLog[]} = {};
    logs?.forEach(log => {
      if (!logsMap[log.groupId]) {
        logsMap[log.groupId] = [];
      }
      logsMap[log.groupId].push(log);
    });
    setAuditLogsMap(logsMap);
    setLoading(false);
  };

  const fetchSettingsLog = useActionCreator(companyActions.fetchSettingsAuditLogs);
  const settingsLogsAsync = useAsync<CompanySettingsChangeLog[]>({
    onSuccess: handleAuditLogs,
    onError: toastError,
  });

  useEffect(() => {
    settingsLogsAsync.start(fetchSettingsLog, settingsLogsAsync);
  }, []);

  const getDisplayText = (
    groupId: string, sectionName: string, changeType: AUDIT_CHANGE_TYPE | undefined, displayText: string,
  ) => {
    let updateEntries = [displayText];
    if (changeType === AUDIT_CHANGE_TYPE.UPDATED) {
      updateEntries = displayText.split(' | ');
    }

    return (
      <>
        {updateEntries.length > 0 && (
          <Typography
            variant="subtitle2"
            className={classes.auditValue}
          >
            <Text message={updateEntries[0]} />
          </Typography>
        )}

        {/* Remaining entries as list */}
        {updateEntries.length > 1 && (
          <ul style={{ paddingLeft: 20, marginTop: 4, marginBottom: 0 }}>
            {updateEntries.slice(1).map((entry, index) => (
              <li key={index}>
                <Typography
                  variant="subtitle2"
                  className={classes.auditValue}
                >
                  <Text message={entry} />
                </Typography>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} aria-labelledby="audit-logs-drawer-title"
      classes={{ paper: classes.drawerAuditLogsPaper }}>
      <AppBar position="sticky" color="default" elevation={0}>
        <Box className={classes.appBarBox}>
          <Typography variant="h4">
            {translate('settings.audit.logs.drawer.title')}
          </Typography>
          <Button size="small" variant="outlined" onClick={onClose} className={classes.buttonSpacing}
            data-cy="settings-drawer-close-btn">
            {translate('common.close')}
          </Button>
        </Box>
      </AppBar>
      {loading && <LinearProgress style={{ width: '100%' }} />}
      {Object.keys(auditLogsMap).map(groupId => {
        const groupEntries = auditLogsMap[groupId];
        // For all the entries in a group, the time and user would be the same as the first entry
        const { updatedAt, ownerName, ownerEmail } = groupEntries[0];
        const finalOwner = { name: ownerName, email: ownerEmail } as User;
        return (
          <Box key={groupId} className={classes.groupBox}>
            <UserAvatarListItem
              name={<span data-cy={`audit-log-${groupId}`}>{finalOwner?.name}</span>}
              user={finalOwner}
              secondaryComponent={
                <DateTime
                  data-cy={`audit-time-${groupId}`}
                  value={updatedAt}
                  format={MomentFormats.BriefDateTime}
                />
              }
            />
            {
              groupEntries.map(companySettingLog => {
                const { parentKeyLabel, changeType, displayText } = companySettingLog;
                return (
                  <Box key={companySettingLog.id} className={classes.logEntry}>
                    <Typography variant="subtitle1" className={classes.auditKey}>
                      {parentKeyLabel} <span className={classes.changeType}>{changeType}</span>
                    </Typography>
                    {
                      getDisplayText(groupId, parentKeyLabel, changeType, displayText)
                    }
                  </Box>
                );
              })
            }
          </Box>
        );
      })}
    </Drawer>
  );
};

export default withThemeNext(SettingsHistoryDrawer);
