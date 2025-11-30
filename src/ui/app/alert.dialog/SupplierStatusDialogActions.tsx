import { Box, Button } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import Text from '../../components/Text';
import { Translation } from '../../translations/types';
import { styles as useStyles } from './AlertDialog.styles';

interface SupplierStatusDialogActionsProps {
  isError: boolean
  isWarning: boolean
  infoLabel?: Translation
  cancelLabel?: Translation
  confirmLabel?: Translation
  confirmAction: (values?) => void
  cancelAction?: (e: React.MouseEvent<HTMLElement>) => void
}

const SupplierStatusDialogActions: React.FC<SupplierStatusDialogActionsProps> = ({
  isError,
  isWarning,
  infoLabel,
  cancelLabel,
  confirmLabel,
  cancelAction,
  confirmAction,
}) => {
  const classes = useStyles();

  return (
    <Box>
      {isWarning && !isError && (
        <Button
          variant="text"
          className={cx(classes.cancelButton, classes.buttonLabel)}
          onClick={cancelAction}
          id="dialog-cancel"
          data-cy="dialog-cancel"
        >
          <Text translation={cancelLabel} />
        </Button>
      )}
      {isWarning && !isError && (
        <Button
          variant="contained"
          className={cx(classes.submitButton, classes.buttonLabel)}
          id="dialog-continue"
          data-cy="dialog-continue"
          onClick={confirmAction}
        >
          <Text translation={confirmLabel} />
        </Button>
      )}
      {isError && (
        <Button
          variant="contained"
          className={cx(classes.submitButton, classes.buttonLabel)}
          id="dialog-continue"
          data-cy="dialog-continue"
          onClick={cancelAction}
        >
          <Text translation={infoLabel} />
        </Button>
      )}
    </Box>
  );
};

export default SupplierStatusDialogActions;
