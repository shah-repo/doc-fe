import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { exportDAM } from '.';
import { FB } from '../../..';
import { translate } from '../../../../../common/intl';
import { companySelectors } from '../../../../../state/ducks/company';
import { userManagementSelectors } from '../../../../../state/ducks/userManagement';
import { toastError } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import { DialogHandler } from '../../../../hooks/useDialog';
import { styles } from './ExportDAMDialog.styles';

interface Props {
  dialog: DialogHandler
}

const ExportDAMDialog: React.FunctionComponent<Props> = ({
  dialog,
}) => {
  const classes = styles();
  const { approvalMatrixFieldState, workspaceState } = FB.useStores();
  const existingRoles = useObserver(() => approvalMatrixFieldState?.getCurrentData('roles') ?? []);
  const numOfRevStages = useSelector(companySelectors.getCompanyMaxRevisionStage);
  const groupOptions = useSelector(userManagementSelectors.getOfficialGroups).map((group) => ({
    id: group.value,
    name: group.label,
  }));
  const [fileName, saveFileName] = useState('');

  useEffect(() => {
    if (dialog.isOpen) {
      saveFileName('');
    }
  }, [dialog.isOpen]);

  const handleFileName = (ev: React.ChangeEvent<any>) => {
    saveFileName(ev.target.value);
  };

  const onDownload = () => {
    if(isEmpty(fileName)) {
      return toastError(translate('document.revision.enter.valid.file.name'));
    }
    const damName = `${workspaceState?.document?.document.docId} - ${workspaceState?.document?.name} - Rev ${workspaceState?.document?.displayRevision}`;
    exportDAM(approvalMatrixFieldState, groupOptions, existingRoles, numOfRevStages, fileName, damName);
    dialog.close();
  };

  return (
    <>
      {
        dialog.isOpen
        && <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="sm"
          PaperProps={{ id: 'damExportDialog' }}
        >
          <DialogContent>
            <Box textAlign="center" marginBottom="20px" whiteSpace="pre-line">
              <DialogContentText>
                <Box className={classes.dialogContent}>
                  <Typography variant="subtitle1" className={classes.subtitle}>
                    <Text translation="document.revision.enter.file.name" />
                  </Typography>
                  <TextField
                    error={fileName === ''}
                    variant="outlined"
                    id="dam-export-file-name"
                    style={{ width: 400 }}
                    onChange={handleFileName}
                  />
                </Box>
              </DialogContentText>
            </Box>
          </DialogContent>
          <Box className={classes.dialogAction} >
            <Button
              variant="contained"
              className={classes.cancelButton}
              onClick={dialog.close}
              id="dam-export-cancel-button"
            >
              <Text translation="common.cancel" />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              id="dam-export-download-button"
              data-cy="dam-export-download-button"
              onClick={onDownload}
            >
              <Text translation="common.download" />
            </Button>
          </Box>
        </Dialog>
      }
    </>
  );
};

export default ExportDAMDialog;
