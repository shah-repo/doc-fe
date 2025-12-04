import { AppBar, Box, Drawer, LinearProgress, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { MomentFormats } from '../../../../../common/utils/date';
import { User } from '../../../../../state/ducks/common/types';
import { companyActions } from '../../../../../state/ducks/company';
import { Employee } from '../../../../../state/ducks/company/types';
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

interface OwnerMap { [key: string]: Employee }

const UIKey = 'readFromUi_';
const materialFlowAclParentKey = 'materialFlowAcl';

export interface AuditLogsResponse {
  logs: CompanySettingsChangeLog[]
  ownerMap: OwnerMap
}

const SettingsHistoryDrawer: React.FC<SettingsHistoryDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [auditLogsMap, setAuditLogsMap] = useState<{[key: string]: CompanySettingsChangeLog[]}>({});
  const [ownerMap, setOwnerMap] = useState<OwnerMap>({});

  const handleAuditLogs = (response?: AuditLogsResponse) => {
    const logsMap: {[key: string]: CompanySettingsChangeLog[]} = {};
    const { logs, ownerMap = {} } = response ?? {};
    logs?.forEach(log => {
      if (!logsMap[log.groupId]) {
        logsMap[log.groupId] = [];
      }
      logsMap[log.groupId].push(log);
    });
    setAuditLogsMap(logsMap);
    setOwnerMap(ownerMap);
    setLoading(false);
  };

  const fetchSettingsLog = useActionCreator(companyActions.fetchSettingsAuditLogs);
  const settingsLogsAsync = useAsync<AuditLogsResponse>({
    onSuccess: handleAuditLogs,
    onError: toastError,
  });

  useEffect(() => {
    settingsLogsAsync.start(fetchSettingsLog, settingsLogsAsync);
  }, []);

  const getDisplayText = (
    groupId: string, parentKey: string, changeType: AUDIT_CHANGE_TYPE | undefined, displayText: string,
  ) => {
    let displayEntries = [displayText];
    if (changeType && [AUDIT_CHANGE_TYPE.UPDATED, AUDIT_CHANGE_TYPE.ADDED].includes(changeType)) {
      displayEntries = displayText.split(' | ');
    }

    const showHeaderEntry = shouldDisplayHeader(changeType, displayEntries.length, parentKey);
    const listEntriesSpliceValue = showHeaderEntry ? 1 : 0;

    return (
      <>
        {showHeaderEntry && (
          <Typography
            variant="subtitle2"
            className={classes.auditValue}
            data-cy={`audit-log-entry-${groupId}-${parentKey}-main`}
          >
            <Text message={getTranslatedLabelText(displayEntries[0])} />
          </Typography>
        )}

        {/* Remaining entries as list */}
        {displayEntries.length > 1 && (
          <ul className={classes.displayEntryList}
            data-cy={`audit-log-entry-${groupId}-${parentKey}-list`}
          >
            {displayEntries.slice(listEntriesSpliceValue).map((entry, index) => (
              <li key={index}>
                <Typography
                  variant="subtitle2"
                  className={classes.auditValue}
                  data-cy={`audit-log-entry-${groupId}-${parentKey}-list-item`}
                >
                  <Text message={getTranslatedLabelText(entry)} />
                </Typography>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  const shouldDisplayHeader = (changeType, entryCount, parentKey): boolean => {
    let showHeaderEntry = true;

    const isChangeTypeAdded = changeType === AUDIT_CHANGE_TYPE.ADDED;
    const isChangeTypeUpdated = changeType === AUDIT_CHANGE_TYPE.UPDATED;

    if (isChangeTypeAdded) {
      showHeaderEntry = entryCount === 1;
    } else if (isChangeTypeUpdated) {
      showHeaderEntry = parentKey !== materialFlowAclParentKey;
    } else {
      showHeaderEntry = true;
    }

    return showHeaderEntry;
  };

  const getTranslatedLabelText = (text: string) => {
    return text
      .split(/\s+/)
      .map((word) => {
        if (!word.includes(UIKey)) return word;

        const uiTranslationText = word.slice(UIKey.length);
        return translate(uiTranslationText);
      })
      .join(' ');
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
      {loading && <LinearProgress className={classes.fullWidth} />}
      {Object.keys(auditLogsMap).map(groupId => {
        const groupEntries = auditLogsMap[groupId];
        // For all the entries in a group, the time and user would be the same as the first entry
        const { updatedAt, ownerName, ownerEmail, ownerId } = groupEntries[0];
        const finalOwner = ownerMap[ownerId]?.user ?? { name: ownerName, email: ownerEmail } as User;
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
                const { parentKeyLabel, changeType, displayText, parentKey } = companySettingLog;
                const parentKeyLabelToUse = getTranslatedLabelText(parentKeyLabel);
                return (
                  <Box key={companySettingLog.id} className={classes.logEntry}>
                    <Typography variant="subtitle1" className={classes.auditKey}
                      data-cy={`change-key-${parentKey}-${changeType}`}
                    >
                      {parentKeyLabelToUse} <span className={classes.changeType}>{changeType}</span>
                    </Typography>
                    {
                      getDisplayText(groupId, parentKey, changeType, displayText)
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
