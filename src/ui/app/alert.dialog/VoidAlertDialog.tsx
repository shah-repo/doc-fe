import { Box } from '@material-ui/core';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { MomentFormats, TIME_ZONE } from '../../../common/utils/date';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { checkIsDocumentRecord } from '../../documentRevision/helpers/checkDocumentGroup';
import { FB, FBFormState, FBProvider, FBTextField } from '../../form.builder';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync, { Async } from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import AlertDialog from './AlertDialog';
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
  const formState = FB.useRef(FBFormState, {});
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

  const voidRecord = () => {
    formState?.validate((valid) => {
      if (!valid) {
        return;
      }

      const voidDescriptoin = String(formState?.getFieldValue(VOID_DESCRIPTION_FIELD));
      const description = `<p>Void</p>
      <p>${voidDescriptoin}</p>
      <p>${docRevOwner}, ${moment().tz(TIME_ZONE).format(MomentFormats.DateTime)}</p>`;

      async.start(
        voidDocument,
        docRevId,
        isRecordBehaviour ? { description } : undefined,
        async,
      );
    }, true);
  };

  if (!dialog.isOpen) {
    return null;
  }

  return (
    <FBProvider {...{ formState }}>
      <AlertDialog
        {...props}
        message={isRecordBehaviour ? 'documentRevision.record.void.alert' : 'documentRevision.void.alert'}
        cancelAction={dialog.close}
        confirmAction={confirmAction ?? voidRecord}
        isLoading={async.isLoading}
      >
        {isRecordBehaviour && (
          <Box className={classes.descriptionBox}>
            <FBTextField
              name={VOID_DESCRIPTION_FIELD}
              label="common.justification"
              dataCy="void.record.description"
              rules="required"
              rows={3}
            />
          </Box>
        )}
      </AlertDialog>
    </FBProvider>
  );
};

export default VoidedAlertDialog;
