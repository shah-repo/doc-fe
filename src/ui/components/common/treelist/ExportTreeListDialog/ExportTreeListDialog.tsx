import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { ReactComponent as ExportIcon } from '../../../../../assets/images/icon_export_data.svg';
import { DialogHandler } from '../../../../hooks/useDialog';
import Text from '../../../Text';
import { styles } from './ExportTreeListDialog.styles';

interface Props {
  dialog: DialogHandler
  confirmDialog: (fileName: string) => void
}

const ExportTreeListDialog: React.FunctionComponent<Props> = ({
  dialog,
  confirmDialog,
}) => {
  const classes = styles();
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (dialog.isOpen) {
      setFileName('');
    }
  }, [dialog.isOpen]);

  const onFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const onSubmit = () => {
    if (fileName) {
      dialog.close();
      confirmDialog(fileName);
    }
  };

  return (
    <>
      {dialog.isOpen && (
        <Dialog
          open={dialog.isOpen}
          onClose={dialog.close}
          maxWidth="sm"
          PaperProps={{ id: 'export-tree-list-dialog' }}
        >
          <DialogContent>
            <Box textAlign="center" className={classes.dialogBody}>
              <Box textAlign="center">
                <span className={classes.iconContainer}>
                  <ExportIcon className={classes.exportIcon} />
                </span>
                <Typography variant="h6" className={classes.title}>
                  <Text translation="document.revision.export.list" />
                </Typography>
              </Box>
              <DialogContentText>
                <Box className={classes.dialogContent}>
                  <Typography variant="subtitle1" className={classes.subtitle}>
                    <Text translation="document.revision.enter.file.name" />
                  </Typography>
                  <TextField
                    error={fileName === ''}
                    variant="outlined"
                    id="exportTreeNameField"
                    data-cy="export-tree-name-field"
                    style={{ width: 400 }}
                    onChange={onFileNameChange}
                  />
                </Box>
              </DialogContentText>
            </Box>
          </DialogContent>
          <Box className={classes.dialogAction}>
            <Button
              variant="contained"
              className={classes.cancelButton}
              onClick={dialog.close}
              id="exportTreeCancelButton"
              data-cy="export-tree-cancel-button"
            >
              <Text translation="common.cancel" />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.confirmButton}
              id="exportTreeConfirmButton"
              data-cy="export-tree-confirm-button"
              onClick={onSubmit}
            >
              <Text translation="common.download" />
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default ExportTreeListDialog;
