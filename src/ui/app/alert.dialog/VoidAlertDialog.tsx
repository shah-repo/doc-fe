import { Typography } from '@material-ui/core';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { translate } from '../../../common/intl';
import { MomentFormats, TIME_ZONE } from '../../../common/utils/date';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import AlertDialog from '../../components/dialogs/Alert';
import { checkIsDocumentRecord } from '../../documentRevision/helpers/checkDocumentGroup';
import { useFormik, FormikProvider } from 'formik';
import { FormikField, TextField } from '../../components/forms/fields-next';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync, { Async } from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { styles } from './AlertDialog.styles';

interface Props {
  dialog: DialogHandler
  async?: Async
  documentRevision?: DocumentRevision
  confirmAction?: () => void
}

const VOID_DESCRIPTION_FIELD = 'void-description';

const VoidedAlertDialog: React.FunctionComponent<Props> = (props) => {
  const { dialog, documentRevision, confirmAction } = props;

  const docRevId = documentRevision?.id as string;
  const docRevOwner = documentRevision?.owner?.user?.name as string;

  const classes = styles();
  const dispatch = useDispatch();
  const voidDocument = useActionCreator(documentRevisionsActions.voidDocument);
  const dialogAsync = useAsync({
    onSuccess: () => {
      dispatch(documentRevisionsActions.loadAudit(docRevId));
    },
  });
  const async = props.async ?? dialogAsync;

  const isRecordBehaviour = useMemo(
    () => checkIsDocumentRecord(documentRevision?.document?.documentType?.groupOptions ?? []),
    [documentRevision],
  );

  const formik = useFormik({
    initialValues: {
      [VOID_DESCRIPTION_FIELD]: '',
    },
    onSubmit: (values) => {
      if (confirmAction) {
        return confirmAction();
      }

      const description = `<p>Void</p>
      <p>${values[VOID_DESCRIPTION_FIELD]}</p>
      <p>${docRevOwner}, ${moment().tz(TIME_ZONE).format(MomentFormats.DateTime)}</p>`;

      async.start(
        voidDocument,
        docRevId,
        isRecordBehaviour ? { description } : undefined,
        async,
      );
    },
  });

  if (!dialog.isOpen) {
    return null;
  }

  return (
    <FormikProvider value={formik}>
      <AlertDialog
        handler={dialog}
        loading={async.isLoading}
        onConfirm={formik.submitForm}
      >
        <Typography data-cy="dialog-message" className={classes.contentText}>
          {translate(isRecordBehaviour ? 'documentRevision.record.void.alert' : 'documentRevision.void.alert')}
        </Typography>
        {isRecordBehaviour && (
          <FormikField
            className={classes.descriptionField}
            name={VOID_DESCRIPTION_FIELD}
            label={translate('common.justification')}
            required
          >
            <TextField
              {...formik.getFieldProps(VOID_DESCRIPTION_FIELD)}
              multiline
              rows={3}
            />
          </FormikField>
        )}
      </AlertDialog>
    </FormikProvider>
  );
};

export default VoidedAlertDialog;
