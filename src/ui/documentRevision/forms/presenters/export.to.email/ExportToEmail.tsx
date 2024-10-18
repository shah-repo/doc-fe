import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, makeStyles } from '@material-ui/core';
import { omit } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { StyledButton } from '../../../../../App/Shifamed/Components/forms/presenters/StyledListButton';
import { StyledMenuListIcon } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon';
import { StyledMenuListItem } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem';
import { StyledMenuListItemText } from '../../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText';
import SM from '../../../../../App/Shifamed/Utils/SM/SM';
import { authSelectors } from '../../../../../state/ducks/auth';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { Dialog } from '../../../../components/dialogs';
import { toastError, toastSuccess } from '../../../../components/notifications';
import { ExportPDFToastr } from '../../../../components/notifications/ExportPDFToastr';
import { exportPDFToastrStyles } from '../../../../components/notifications/ExportPDFToastr.styles';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import useMqttSubscription from '../../../../hooks/useMqttSubscription';
import ExportToEmailDialogActions from './ExportToEmailDialogActions';
import ExportToEmailModal from './ExportToEmailModal';
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

const style = makeStyles((theme) => ({
  dialogAction: {
    justifyContent: 'space-between',
  },
}));

const ExportToEmail: React.FunctionComponent<Props> = ({
  revisionId,
  canAccess,
  renderAsButton,
}) => {
  const isNewLayout = SM.isNewLayout;
  const intl = useIntl();
  const emailDialog = useDialog();
  const classes = style();
  const [isNoOptionSelected, setNoOptionSelected] = useState<boolean>(false);
  const [isDownloadInprogress, setIsDownloadInprogress] = useState(false);
  const employeeId = useSelector(authSelectors.currentEmployeeId);
  const pdfToastrStyles = exportPDFToastrStyles();

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

  const topic = React.useMemo(() =>
    `${employeeId}/external_export_email/${revisionId}/pdf`
  , [employeeId, revisionId]);

  const callBack = useCallback(() => {
    handleDownloadComplete(true);
    toastSuccess(<ExportPDFToastr />, {
      className: pdfToastrStyles.popup,
      bodyClassName: pdfToastrStyles.popupBody,
      progressClassName: 'progressClassName',
    });
  }, []);

  useMqttSubscription(topic, callBack);

  const exportToEmail = useActionCreator(
    documentRevisionsActions.exportToEmail,
  );
  const childFormRef = useRef();

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
              data-cy="export-to-email"
              primary={<Text translation="common.share" />}
            />
          </StyledMenuListItem>
        );
      }
      return (
        <StyledButton
          color="primary"
          data-cy="export-to-email"
          onClick={emailDialog.open}
        >
          <Text translation="common.share" />
        </StyledButton>
      );
    }

    return (
      <>
        <Button
          data-cy="export-to-email"
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
        title="common.send.to.email"
        open={emailDialog.isOpen}
        loading={isDownloadInprogress}
        onClose={emailDialog.close}
        actionsProps={{ className: classes.dialogAction }}
        actions={ <ExportToEmailDialogActions {...{ handleEmail: runExportWithChildren, emailDialog, isLoading: isDownloadInprogress, isNoOptionSelected }} />}
      >
        <ExportToEmailModal ref={childFormRef} {...{ setNoOptionSelected, isNoOptionSelected, revisionId }} />
      </Dialog>
    </>
  );
};

export default ExportToEmail;
