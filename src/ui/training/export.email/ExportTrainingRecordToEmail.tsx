import { omit } from 'lodash';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../state/ducks/auth';
import { trainingActions } from '../../../state/ducks/training';
import DownloadPDFSockets from '../../app/sockets/DownloadPDFSockets';
import Text from '../../components/Text';
import Dialog from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { toastError, toastSuccess } from '../../components/notifications';
import { ExportPDFCloseButton, ExportPDFToastr } from '../../components/notifications/ExportPDFToastr';
import { exportPDFToastrStyles } from '../../components/notifications/ExportPDFToastr.styles';
import ExportToEmailDialogActions from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailDialogActions';
import ExportToEmailModal, { ExportToEmailDialogRefType } from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailModal';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';

interface Props {
  id: string
}

const ExportTrainingRecordToEmail: React.FunctionComponent<Props> = ({
  id,
}) => {
  const intl = useIntl();
  const exportTrainingRecordEmail = useActionCreator(trainingActions.exportTrainingRecord);
  const childFormRef = useRef<ExportToEmailDialogRefType>();
  const [value, setValue] = useState(false);
  const [isNoOptionSelected, setNoOptionSelected] = useState<boolean>(false);
  const [isDownloadInprogress, setIsDownloadInprogress] = useState(false);
  const classes = exportPDFToastrStyles();
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const emailDialog = useDialog();
  const clientUserAgent = navigator.userAgent;

  const pdfSocketReceived = (data) => {
    const url = data.url;
    setIsDownloadInprogress(false);
    emailDialog.close();

    if (data.userAgent === clientUserAgent && url) {
      window.open(url, '_parent');
    }

    toastSuccess(<ExportPDFToastr />, {
      className: classes.popup,
      bodyClassName: classes.popupBody,
      progressClassName: 'progressClassName',
      closeButton: (props) => <ExportPDFCloseButton {...props} linkInfo={url} />,
      autoClose: false,
    });
  };

  const async = useAsync({
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
      title="common.share"
      open={emailDialog.isOpen}
      loading={isDownloadInprogress}
      onClose={emailDialog.close}
      actionsProps={{ className: classes.dialogAction }}
      actions={ <ExportToEmailDialogActions {...{ handleEmail: runExportWithChildren, emailDialog, isLoading: isDownloadInprogress, isNoOptionSelected }} />}
    >
      <DownloadPDFSockets employeeId={employeeId} pdfSocketReceived={pdfSocketReceived} />
      <ExportToEmailModal
        ref={childFormRef}
        {...{ value, handleChange, setNoOptionSelected, isNoOptionSelected, arId: id, hideEffectiveDateOption: true }}
      />
    </Dialog>
  </>
  );
};

export default ExportTrainingRecordToEmail;
