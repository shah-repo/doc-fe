import { Box } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';
import { MomentFormats, TIME_ZONE } from '../../../common/utils/date';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { FB, FBFormState, FBProvider, FBTextField } from '../../form.builder';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { Translation } from '../../translations/types';
import AlertDialog from './AlertDialog';
import { styles } from './AlertDialog.styles';

interface Props {
  message: Translation
  dialog: DialogHandler
  docRevId: string
  docRevOwner: string
}

const VOID_DESCRIPTION_FIELD = 'void-description';

const VoidedAlertDialog: React.FunctionComponent<Props> = (props) => {
  const {
    dialog,
    docRevId,
    docRevOwner,
  } = props;

  const classes = styles();
  const dispatch = useDispatch();
  const formState = FB.useRef(FBFormState, {});
  const applyTransition = useActionCreator(documentRevisionsActions.voidDocument);
  const releaseAsync = useAsync({
    onSuccess: () => {
      dispatch(documentRevisionsActions.loadAudit(docRevId));
    },
  });

  const voidRecord = () => {
    formState?.validate((valid) => {
      if (!valid) {
        return;
      }

      const voidDescriptoin = String(formState?.getFieldValue(VOID_DESCRIPTION_FIELD));
      const description = `<p>Void</p>
      <p>${voidDescriptoin}</p>
      <p>${docRevOwner}, ${moment().tz(TIME_ZONE).format(MomentFormats.DateTime)}</p>`;

      releaseAsync.start(
        applyTransition,
        docRevId,
        { description },
        releaseAsync,
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
        cancelAction={dialog.close}
        confirmAction={voidRecord}
      >
        <Box className={classes.descriptionBox}>
          <FBTextField
            name={VOID_DESCRIPTION_FIELD}
            label="common.justification"
            dataCy="void.record.description"
            rules="required"
            rows={3}
          />
        </Box>
      </AlertDialog>
    </FBProvider>
  );
};

export default VoidedAlertDialog;
