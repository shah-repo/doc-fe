import { Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../common/intl';
import AlertDialog from '../../components/dialogs/Alert';
import { Async } from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { styles } from './AlertDialog.styles';

interface Props {
  async: Async
  dialog: DialogHandler
  onConfirm: (values: unknown) => void
}

const GRPTWarningDialog: React.FunctionComponent<Props> = (props) => {
  const { async, dialog, onConfirm } = props;

  const classes = styles();

  if (!dialog.isOpen) {
    return null;
  }

  return (
    <AlertDialog
      handler={dialog}
      loading={async.isLoading}
      onConfirm={onConfirm}
      title="common.warning"
      warning={true}
    >
      <Typography data-cy="dialog-message" className={classes.contentText}>
        {translate('training.doc.warning.alert')}
      </Typography>
    </AlertDialog>
  );
};

export default GRPTWarningDialog;
