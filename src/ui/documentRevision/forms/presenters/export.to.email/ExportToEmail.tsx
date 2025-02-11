import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-ui/core';
import { omit } from 'lodash';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { StyledButton } from '../../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../../App/Shifamed/Utils/SM/SM';
import { authSelectors } from '../../../../../state/ducks/auth';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import DownloadPDFSockets, { DownloadPDFSocketsData } from '../../../../app/sockets/DownloadPDFSockets';
import { downloadFile } from '../../../../common/utils/helpers';
import { Dialog } from '../../../../components/dialogs';
import { toastError, toastSuccess } from '../../../../components/notifications';
import { ExportPDFCloseButton, ExportPDFToastr } from '../../../../components/notifications/ExportPDFToastr';
import { exportPDFToastrStyles } from '../../../../components/notifications/ExportPDFToastr.styles';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import ExportToEmailDialogActions from './ExportToEmailDialogActions';
import ExportToEmailModal, { ExportToEmailDialogRefType } from './ExportToEmailModal';
interface Props {
  revisionId: string
  canAccess: boolean
  renderAsButton?: boolean
}

export interface AttachmentsInfo {
  id: string
  name: string
  type: string
  isPrimaryAttachment: boolean
}

const ExportToEmail: React.FunctionComponent<Props> = ({
  revisionId,
  canAccess,
  renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;
  const intl = useIntl();
  const emailDialog = useDialog();
  const [isNoOptionSelected, setNoOptionSelected] = useState<boolean>(false);
  const [isDownloadInprogress, setIsDownloadInprogress] = useState(false);
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const classes = exportPDFToastrStyles();

  const handleDownloadComplete = (isComplete: boolean) => {
    setIsDownloadInprogress(!isComplete);
    emailDialog.close();
  };

  const async = useAsync({
    onError: () => {
      setIsDownloadInprogress(false);
      if (!canAccess) {
        toastError(
          intl.formatMessage({ id: 'common.send.to.email.no.access' }),
        );
        return;
      }
      toastError(intl.formatMessage({ id: 'common.send.to.email.error' }));
    },
  });

  const showNotificationAndDownloadPDF = (data: DownloadPDFSocketsData) => {
    const url = data.url;
    handleDownloadComplete(true);
    emailDialog.close();
    toastSuccess(<ExportPDFToastr />, {
      className: classes.popup,
      bodyClassName: classes.popupBody,
      progressClassName: 'progressClassName',
      closeButton: (props) => <ExportPDFCloseButton {...props} linkInfo={url} />,
      autoClose: false,
      closeOnClick: false,
    });
    window.onbeforeunload = null;
    downloadFile(url);
  };

  const exportToEmail = useActionCreator(
    documentRevisionsActions.exportToEmail,
  );
  const childFormRef = useRef<ExportToEmailDialogRefType>();

  const runExportWithChildren = () => {
    if (childFormRef.current) {
      const values = omit(childFormRef.current.getValues(), 'includeDate');
      setIsDownloadInprogress(true);
      async.start(
        exportToEmail,
        revisionId,
        { ...values, includeAuditLogs: Boolean(values?.includeAuditLogs) },
        async,
      );
    }
  };

  const getUpdatedButton = () => {
    if (isNewLayout) {
      if (!renderAsButton) {
        return (
          <StyledMenuListItem
            button
            alignItems="flex-start"
            onClick={emailDialog.open}
          >
            <StyledMenuListIcon>
              <FontAwesomeIcon icon={regular('share')} size="lg" />
            </StyledMenuListIcon>
            <StyledMenuListItemText
              data-cy="exportToEmail"
              primary={<Text translation="common.share" />}
            />
          </StyledMenuListItem>
        );
      }
      return (
        <StyledButton
          color="primary"
          data-cy="exportToEmail"
          onClick={emailDialog.open}
        >
          <Text translation="common.share" />
        </StyledButton>
      );
    }

    return (
      <>
        <Button
          data-cy="exportToEmail"
          variant="outlined"
          color="secondary"
          onClick={emailDialog.open}
        >
          <Text translation="common.send.to.email" />
        </Button>
      </>
    );
  };

  return (
    <>
      {getUpdatedButton()}
      <Dialog
        title="common.share"
        open={emailDialog.isOpen}
        onClose={emailDialog.close}
        actionsProps={{ className: classes.dialogAction }}
        actions={ <ExportToEmailDialogActions {...{ handleEmail: runExportWithChildren, emailDialog, isLoading: isDownloadInprogress, isNoOptionSelected }} />}
      >
        <DownloadPDFSockets employeeId={employeeId} revId={revisionId} showNotificationAndDownloadPDF={showNotificationAndDownloadPDF} />
        <ExportToEmailModal ref={childFormRef} {...{ setNoOptionSelected, isNoOptionSelected, revisionId }} />
      </Dialog>
    </>
  );
};

export default ExportToEmail;
