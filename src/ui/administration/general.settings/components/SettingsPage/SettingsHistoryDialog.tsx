import { AppBar, Box, Button, Dialog, DialogContent, Typography } from '@material-ui/core';
import Email from '@material-ui/icons/EmailRounded';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { MomentFormats, useDate } from '../../../../../common/utils/date';
import { companyActions } from '../../../../../state/ducks/company';
import { toastError } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { CompanySettingsChangeLog } from '../../types';
import useStyles from './styles';

interface SettingsHistoryDialogProps {
  isOpen: boolean
  handleClose: () => void
}

const SettingsHistoryDialog: React.FC<SettingsHistoryDialogProps> = ({
  isOpen,
  handleClose,
}) => {
  const classes = useStyles();
  const { getFormattedDateString } = useDate();

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
    // console.log(logs);
  };

  const fetchSettingsLog = useActionCreator(companyActions.fetchSettingsAuditLogs);
  const settingsLogsAsync = useAsync<CompanySettingsChangeLog[]>({
    onSuccess: handleAuditLogs,
    onError: toastError,
  });

  useEffect(() => {
    settingsLogsAsync.start(fetchSettingsLog, settingsLogsAsync);
  }, []);

  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose} aria-labelledby="audit-logs-dialog-title">
      <AppBar position="static" color="default" elevation={0}>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 16px' }}>
          <Typography variant="h4">
            {translate('settings.audit.logs.dialog.title')}
          </Typography>
          <Button size="small" variant="outlined" onClick={handleClose} className={classes.buttonSpacing}>
            {translate('common.close')}
          </Button>
        </Box>
      </AppBar>
      <DialogContent>
        {Object.keys(auditLogsMap).map(groupId => (
          <Box key={groupId} className={classes.groupBox}>
            {
              auditLogsMap[groupId]?.map(companySettingLog => (
                <Box key={companySettingLog.id} className={classes.logEntry}>
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box style={{ width: '15%' }}>
                      <Typography variant="subtitle2">
                        <Text message={getFormattedDateString(
                          companySettingLog.updatedAt,
                          MomentFormats.BriefDateTime,
                        )} />
                      </Typography>
                    </Box>
                    <Box style={{ width: '60%' }}>
                      <Typography variant="body1" className={classes.parentKey}>
                        {companySettingLog.parentKeyLabel}
                      </Typography>
                      <Typography variant="subtitle2" className={classes.displayText}>
                        {companySettingLog.displayText}
                      </Typography>
                    </Box>
                    <Box style={{ width: '25%', textAlign: 'right' }}>
                      <Typography variant="subtitle2" className={classes.ownerName}>
                        {companySettingLog.ownerName}
                      </Typography>
                      <Typography variant="subtitle2" className={classes.ownerEmail}>
                        <Email className={classes.email} /> {companySettingLog.ownerEmail}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            }
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default SettingsHistoryDialog;
