import { omit } from 'lodash';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { trainingActions } from '../../../state/ducks/training';
import Text from '../../components/Text';
import Dialog from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { toastError } from '../../components/notifications';
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
  // const employeeId = useSelector(authSelectors.currentEmployeeId);
  const emailDialog = useDialog();
  // const notificationInitiatedRef = useRef(false);

  const async = useAsync({
    onError: () => {
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });

  // const topic = React.useMemo(() =>
  //   `${employeeId}/external_export_email/+/pdf`
  // , [employeeId]);

  // const callBack = useCallback((data) => {
  //   setIsDownloadInprogress(false);
  //   emailDialog.close();
  //   if (!notificationInitiatedRef.current) {
  //     notificationInitiatedRef.current = true;
  //     toastSuccess(<ExportPDFToastr />, {
  //       className: classes.popup,
  //       bodyClassName: classes.popupBody,
  //       progressClassName: 'progressClassName',
  //       closeButton: (props) => <ExportPDFCloseButton {...props} linkInfo={data} />,
  //       autoClose: false,
  //     });
  //     setTimeout(() => {
  //       notificationInitiatedRef.current = false;
  //     }, 5000);
  //   }
  // }, []);

  // useMqttSubscription(topic, callBack);

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
      data-cy="exportToEmail"
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
      <ExportToEmailModal
        ref={childFormRef}
        {...{ value, handleChange, setNoOptionSelected, isNoOptionSelected, arId: id, hideEffectiveDateOption: true }}
      />
    </Dialog>
  </>
  );
};

export default ExportTrainingRecordToEmail;
