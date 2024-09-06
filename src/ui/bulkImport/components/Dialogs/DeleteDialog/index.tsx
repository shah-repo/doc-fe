import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Button } from '../../../../components/forms/fields-next';

import useStyles from './styles';

interface BulkImportProgressProps {
  open?: boolean
  handleConfirm?: () => void
  handleClose?: () => void
}

const DeleteDialog: React.FC<BulkImportProgressProps> = ({
  open = false,
  handleConfirm = noop,
  handleClose = noop,
}) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setIsLoading(false);
    }
  }, [open]);

  const onConfirm = () => {
    setIsLoading(true);
    handleConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
    >
      <DialogTitle id="alert-dialog-title" className={classes.headerContainer}>
        <FontAwesomeIcon
          className={classes.exclamationIcon}
          icon={regular('triangle-exclamation')}
        />
        {translate('common.alert')}
      </DialogTitle>
      <DialogContent className={classes.bodyContainer}>
          <p>{translate('bulkImport.deleteDialogDescription')}</p>
          <p>{translate('bulkImport.areYouSureWantToContinue')}</p>
      </DialogContent>
      <DialogActions className={classes.buttonsContainer}>
        <Button onClick={handleClose} color="primary" kind="ghost">
          {translate('common.no.go.back')}
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus disabled={isLoading}>
          {translate('common.yes.im.sure')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
