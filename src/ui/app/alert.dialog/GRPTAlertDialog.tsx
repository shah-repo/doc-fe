import { Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreator } from 'redux';
import { translate } from '../../../common/intl';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { ApiAction } from '../../../state/types';
import AlertDialog from '../../components/dialogs/Alert';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync, { Async } from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { styles } from './AlertDialog.styles';

interface Props {
  dialog: DialogHandler
  async?: Async
  documentRevision: DocumentRevision
  completeAction?: ActionCreator<ApiAction<DocumentRevision>>
}

const GRPTAlertDialog: React.FunctionComponent<Props> = (props) => {
  const { dialog, documentRevision } = props;

  const docRevId = documentRevision?.id;

  const classes = styles();
  const dispatch = useDispatch();
  const completeAction = useActionCreator(props.completeAction ?? documentRevisionsActions.approveAndRelease);
  const dialogAsync = useAsync({
    onSuccess: () => {
      dispatch(documentRevisionsActions.loadAudit(docRevId));
    },
  });
  const async = props.async ?? dialogAsync;

  const onConfirm = () => {
    console.log('Release');
    async.start(
      completeAction,
      docRevId,
      async,
    );
  };

  if (!dialog.isOpen) {
    return null;
  }

  return (
      <AlertDialog
        handler={dialog}
        loading={async.isLoading}
        onConfirm={onConfirm}
        cancelLabel="training.label.cancel"
        confirmLabel="training.label.continue"
        title="common.warning"
        PaperProps={{
          id: 'warnDialog',
        }}
        cancelProps={{
          id: 'AlertDialog-cancelButton',
          'data-cy': 'AlertDialog-cancelButton',
        }}
        confirmProps={{
          id: 'AlertDialog-continueButton',
          'data-cy': 'AlertDialog-continueButton',
        }}
      >
        <Typography data-cy="dialog-message" className={classes.contentText}>
          {translate('training.doc.warning.alert')}
        </Typography>
      </AlertDialog>
  );
};

export default GRPTAlertDialog;
