import { makeStyles } from '@material-ui/core';
import { omit } from 'lodash';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { trainingActions } from '../../../state/ducks/training';
import Text from '../../components/Text';
import Dialog from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { toastError, toastSuccess } from '../../components/notifications';
import { ExportPDFToastr } from '../../components/notifications/ExportPDFToastr';
import { exportPDFToastrStyles } from '../../components/notifications/ExportPDFToastr.styles';
import ExportToEmailDialogActions from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailDialogActions';
import ExportToEmailModal from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailModal';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';

interface Props {
  id: string
}

const style = makeStyles((theme) => ({
  dialogAction: {
    justifyContent: 'flex-end',
  },
}));

const ExportTrainingRecordToEmail: React.FunctionComponent<Props> = ({
  id,
}) => {
  const intl = useIntl();
  const classes = style();
  const exportTrainingRecordEmail = useActionCreator(trainingActions.exportTrainingRecord);
  const childFormRef = useRef();
  const [value, setValue] = useState(false);
  const [isNoOptionSelected, setNoOptionSelected] = useState<boolean>(false);
  const [isDownloadInprogress, setIsDownloadInprogress] = useState(false);
  const emailDialog = useDialog();
  const pdfToastrStyles = exportPDFToastrStyles();

  const async = useAsync({
    onSuccess: () => {
      setIsDownloadInprogress(false);
      emailDialog.close();
      toastSuccess(<ExportPDFToastr />, {
        className: pdfToastrStyles.popup,
        bodyClassName: pdfToastrStyles.popupBody,
        progressClassName: 'progressClassName',
      });
    },
    onError: () => {
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });

  const runExportWithChildren = () => {
    if (childFormRef.current) {
      const values = omit(childFormRef.current.getValues(), 'includeDate');
      setIsDownloadInprogress(true);
      async.start(
        exportTrainingRecordEmail,
        id,
        { ...values, includeAuditLogs: Boolean(values?.includeAuditLogs) },
        async,
      );
    }
  };
  const handleChange = (event) => {
    setValue(event.target.value === 'true');
  };

  return (<>
    <Button
      variant="outlined"
      color="primary"
      data-cy="export-to-email"
      onClick={emailDialog.open}
    >
      <Text translation="common.share" />
    </Button>
    <Dialog
      title="common.send.to.email"
      open={emailDialog.isOpen}
      loading={isDownloadInprogress}
      onClose={emailDialog.close}
      actionsProps={{ className: classes.dialogAction }}
      actions={ <ExportToEmailDialogActions {...{ handleEmail: runExportWithChildren, emailDialog, isLoading: isDownloadInprogress, isNoOptionSelected }} />}
    >
      <ExportToEmailModal
        ref={childFormRef}
        {...{ value, handleChange, setNoOptionSelected, isNoOptionSelected, arId: id, hideEffectiveDateOption: true }}
      />
    </Dialog>
  </>
  );
};

export default ExportTrainingRecordToEmail;
