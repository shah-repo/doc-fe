import { Typography } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreator } from 'redux';
import * as Yup from 'yup';
import { translate } from '../../../common/intl';
import { MomentFormats, TIME_ZONE } from '../../../common/utils/date';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { DOC_TYPE_GROUP } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../state/reducers';
import { ApiAction } from '../../../state/types';
import AlertDialog from '../../components/dialogs/Alert';
import { FormikField, TextField } from '../../components/forms/fields-next';
import { checkIsDocumentDirectApproved } from '../../documentRevision/helpers/checkDocumentGroup';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync, { Async } from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { styles } from './AlertDialog.styles';

interface Props {
  dialog: DialogHandler
  async?: Async
  documentRevision: DocumentRevision
  voidAction?: ActionCreator<ApiAction<DocumentRevision>>
}

const VOID_DESCRIPTION_FIELD = 'void-description';

const VoidAlertDialog: React.FunctionComponent<Props> = (props) => {
  const { dialog, documentRevision } = props;

  const docRevId = documentRevision.id;
  const docRevOwner = documentRevision.owner.user.name;

  const classes = styles();
  const dispatch = useDispatch();
  const voidAction = useActionCreator(props.voidAction ?? documentRevisionsActions.voidDocument);
  const dialogAsync = useAsync({
    onSuccess: () => {
      dispatch(documentRevisionsActions.loadAudit(docRevId));
    },
  });
  const async = props.async ?? dialogAsync;
  const currentDocumentType = useSelector(
    (state: ApplicationState) => (
      documentTypeSelectors.getDocumentTypeById(state, documentRevision.document.documentType.id ?? '')
    ),
  );

  const isLot = currentDocumentType?.group === DOC_TYPE_GROUP.LOT;
  const isWO = currentDocumentType?.group === DOC_TYPE_GROUP.WORK_ORDER;
  const isRecordBehaviour = useMemo(
    () => checkIsDocumentDirectApproved(documentRevision.document.documentType.groupOptions ?? []),
    [documentRevision],
  );

  const formik = useFormik({
    initialValues: {
      [VOID_DESCRIPTION_FIELD]: '',
    },
    validationSchema: isRecordBehaviour ? Yup.object().shape({
      [VOID_DESCRIPTION_FIELD]: Yup.string().trim().required('validator.justification'),
    }) : undefined,
    onSubmit: (values) => {
      let description = `<p>Void</p>
      <p>${values[VOID_DESCRIPTION_FIELD]}</p>
      <p data-source="void">${docRevOwner}, ${moment().tz(TIME_ZONE).format(MomentFormats.DateTime)}</p>`;

      if (isLot || isWO) {
        description += documentRevision.description ?? '';
      }

      async.start(
        voidAction,
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
        PaperProps={{
          id: 'alertDialog',
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
              data-cy="void.record.description"
              multiline
              rows={3}
            />
          </FormikField>
        )}
      </AlertDialog>
    </FormikProvider>
  );
};

export default VoidAlertDialog;
