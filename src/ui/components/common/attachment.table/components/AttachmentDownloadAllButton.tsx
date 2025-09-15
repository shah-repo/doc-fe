import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { translate } from '../../../../../common/intl';
import { attachmentsActions } from '../../../../../state/ducks/attachments';
import { LINE_TYPES } from '../../../../../state/ducks/attachments/constants';
import { Attachment, AttachmentDownloadResponse } from '../../../../../state/ducks/attachments/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { isDocumentRevisionDeprecated, isDocumentRevisionInDraft, isDocumentRevisionInReview, isDocumentRevisionObsolete, isDocumentRevisionPendingChange } from '../../../../documentRevision/helpers/documentRevisionStatus';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { Translation } from '../../../../translations/types';
import { toastError } from '../../../notifications';
import PasswordDialog from '../../../password/dialog';
import { Password } from '../../../password/types';
import AttachmentRedLineWarningDialog from '../../attachment.redline.warning/dialog';
import { useStyles } from '../styles';

interface Props {
  docRevId: string
  containsRedline: boolean
  docRevStatus: DocumentRevisionStatus
  selectedAttachments?: {[id: string]: boolean | number[]}
  documentRevision?: DocumentRevision
}

const AttachmentDownloadAllButton: React.FunctionComponent<Props> = ({
  docRevId,
  containsRedline,
  docRevStatus,
  selectedAttachments,
  documentRevision,
}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const downloadAllAttachments = useActionCreator(attachmentsActions.downloadAllAttachments);
  const downloadAllAttachmentsPassword = useActionCreator(attachmentsActions.downloadAllAttachmentsPassword);
  const downloadSelectedAttachments = useActionCreator(attachmentsActions.downloadSelectedAttachments);
  const downloadSelectedAttachmentsPassword = useActionCreator(attachmentsActions.downloadSelectedAttachmentsPassword);
  const passwordDialogHandler = useDialog();
  const redlineWarningDialogHandler = useDialog();
  const selectedAttachmentsCount = Object.values(selectedAttachments ?? {}).filter(value => value === true).length;
  const attachments = selectedAttachments && Object.keys(selectedAttachments).filter(key => selectedAttachments[key]);
  const classes = useStyles();

  const attachmentsData = (
    documentRevision?.attachments ?? getFieldProps('attachments').value ?? []
  ) as Attachment[];

  const isDocumentStatusAllowRedlineDowload = (
    isDocumentRevisionInDraft(docRevStatus)
    || isDocumentRevisionPendingChange(docRevStatus)
    || isDocumentRevisionInReview(docRevStatus)
  );
  const isDocumentStatusRequirePassword = (
    isDocumentRevisionObsolete(docRevStatus)
    || isDocumentRevisionDeprecated(docRevStatus)
  );
  const isDownloadAll = selectedAttachmentsCount === 0 || selectedAttachmentsCount === attachmentsData?.length;

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      setIsDownloading(false);
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, '_parent');
    },
    onError: (message) => {
      setIsDownloading(false);
      message && toastError(message);
    },
  });

  const sendRequestWithPassword = (values: Password) => {
    isDownloadAll
      ? async.start(downloadAllAttachmentsPassword, docRevId, async, values.password)
      : async.start(downloadSelectedAttachmentsPassword, docRevId, attachments, async);

    passwordDialogHandler.close();
  };

  const warningPasswordText = (): Translation => {
    if (isDocumentRevisionObsolete(docRevStatus)) {
      return 'common.attachment.redline.warning.download.obsoletedAll';
    }

    if (isDocumentRevisionDeprecated(docRevStatus)) {
      return 'common.attachment.redline.warning.download.deprecatedAll';
    }

    return 'common.attachment.redline.warning.download.redlineAll';
  };

  const openPasswordDialog = () => {
    redlineWarningDialogHandler.close();
    passwordDialogHandler.open();
  };

  const dowloadAttachments = () => {
    const attachmentsToDownload = attachmentsData.filter(
      attachment => isDownloadAll || attachments?.includes(attachment.id),
    );
    const hasRedlineAttachmentToDownload = attachmentsToDownload.some(
      attachment => attachment.lineType === LINE_TYPES.RED_LINE,
    );

    const isPasswordRequiredByRedline = hasRedlineAttachmentToDownload && !isDocumentStatusAllowRedlineDowload;

    setIsDownloading(true);
    if (!isDocumentStatusRequirePassword && !isPasswordRequiredByRedline) {
      isDownloadAll
        ? async.start(downloadAllAttachments, docRevId, async)
        : async.start(downloadSelectedAttachments, docRevId, attachments, async);
      return;
    }

    redlineWarningDialogHandler.open();
  };

  const closeDialogs = () => {
    passwordDialogHandler.close();
    redlineWarningDialogHandler.close();
    setIsDownloading(false);
  };

  if (isEmpty(attachmentsData)) {
    return null;
  }

  return (
    <>
      <AttachmentRedLineWarningDialog
        isDialogOpen={redlineWarningDialogHandler.isOpen}
        onSubmit={openPasswordDialog}
        closeDialog={closeDialogs}
        asyncState={async.asyncState}
        translationText={warningPasswordText()}
        translationButtonText="common.attachment.redline.warning.download.labelAll"
      />
      <PasswordDialog
        isDialogOpen={passwordDialogHandler.isOpen}
        onSubmit={sendRequestWithPassword}
        closeDialog={closeDialogs}
        asyncState={async.asyncState}
      />
      <Tooltip title={translate(isDownloadAll ? 'common.download.all.files' : 'common.download.selected.files')}>
        <IconButton className={classes.actionButton} onClick={dowloadAttachments}>
          {isDownloading
            ? <CircularProgress className={classes.actionButtonIcon} />
            : <FontAwesomeIcon icon={regular('arrow-down-to-line')} className={classes.actionButtonIcon} />
          }
        </IconButton>
      </Tooltip>
    </>
  );
};

export default AttachmentDownloadAllButton;
