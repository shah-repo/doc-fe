import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce, omit } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { SM } from '../../../App';
import { StyledButton } from '../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import { authSelectors } from '../../../state/ducks/auth';
import { changeRequestsActions } from '../../../state/ducks/changeRequest';
import { Dialog } from '../../components/dialogs';
import { Button } from '../../components/forms/fields-next';
import { toastError, toastSuccess } from '../../components/notifications';
import { ExportPDFCloseButton, ExportPDFToastr } from '../../components/notifications/ExportPDFToastr';
import { exportPDFToastrStyles } from '../../components/notifications/ExportPDFToastr.styles';
import Text from '../../components/Text';
import ExportToEmailDialogActions from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailDialogActions';
import ExportToEmailModal, { ExportToEmailDialogRefType } from '../../documentRevision/forms/presenters/export.to.email/ExportToEmailModal';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import useMqttSubscription from '../../hooks/useMqttSubscription';

interface Props {
  id: string
  renderAsButton?: boolean
}

const ExportARToEmail: React.FunctionComponent<Props> = ({
  id, renderAsButton,
}) => {
  const intl = useIntl();
  const classes = exportPDFToastrStyles();
  const emailDialog = useDialog();
  const [value, setValue] = useState(false);
  const [isNoOptionSelected, setNoOptionSelected] = useState(false);
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const [isDownloadInprogress, setIsDownloadInprogress] = useState(false);
  const handleChange = (event) => {
    setValue(event.target.value === 'true');
  };
  const exportTrainingRecordEmail = useActionCreator(changeRequestsActions.exportAR);
  const isNewLayout = SM.isNewCRLayout || SM.isNewLayout;
  const async = useAsync({
    onError: () => {
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });
  const childFormRef = useRef<ExportToEmailDialogRefType>();

  const topic = React.useMemo(() =>
    `${employeeId}/external_export_email/${id}/pdf`
  , [employeeId, id]);

  const callBack = useCallback(debounce((data) => {
    setIsDownloadInprogress(false);
    emailDialog.close();
    toastSuccess(<ExportPDFToastr />, {
      className: classes.popup,
      bodyClassName: classes.popupBody,
      progressClassName: 'progressClassName',
      closeButton: (props) => <ExportPDFCloseButton {...props} linkInfo={data} />,
      autoClose: false,
    });
  }, 1000), []);

  useMqttSubscription(topic, callBack);

  const handleAREmail = () => {
    if (childFormRef.current) {
      setIsDownloadInprogress(true);
      const values = omit(childFormRef.current.getValues(), 'includeDate');
      async.start(
        exportTrainingRecordEmail,
        id,
        { ...values, includeAuditLogs: Boolean(values?.includeAuditLogs) },
        async,
      );
    }
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (<StyledMenuListItem button alignItems="flex-start" onClick={emailDialog.open}>
          <StyledMenuListIcon><FontAwesomeIcon icon={regular('share')} size="lg" /></StyledMenuListIcon>
          <StyledMenuListItemText
            data-cy="export-to-email"
            primary={<Text translation="common.share" />}
          />
        </StyledMenuListItem>
        );
      }
      return (
        <StyledButton
          color="primary"
          style={{ margin: 0 }}
          data-cy="export-to-email"
          onClick={emailDialog.open}
        >
          <Text translation="common.send.to.email" />
        </StyledButton>
      );
    }

    return (
      <Button
        kind="white"
        data-cy="export-to-email"
        onClick={emailDialog.open}
      >
        <Text translation="common.send.to.email" />
      </Button>
    );
  };

  return (
    <>
      {getUpdatedButton()}
      <Dialog
        title="common.share"
        open={emailDialog.isOpen}
        loading={isDownloadInprogress}
        onClose={emailDialog.close}
        actions={ <ExportToEmailDialogActions {...{ handleEmail: handleAREmail, emailDialog, isLoading: isDownloadInprogress, isNoOptionSelected }} />}
        actionsProps={{ className: classes.dialogAction }}
      >
        <ExportToEmailModal
          ref={childFormRef}
          {...{ value, handleChange, setNoOptionSelected, isNoOptionSelected, arId: id }}
        />
      </Dialog>
    </>
  );
};

export default ExportARToEmail;
