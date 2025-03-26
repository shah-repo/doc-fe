import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty, isUndefined } from 'lodash';
import React, { useState } from 'react';
import { translate } from '../../../../../common/intl';
import { attachmentsActions } from '../../../../../state/ducks/attachments';
import { LINE_TYPES } from '../../../../../state/ducks/attachments/constants';
import { Attachment, AttachmentDownloadResponse } from '../../../../../state/ducks/attachments/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../../../../state/types';
import { isDocumentRevisionDeprecated, isDocumentRevisionInDraft, isDocumentRevisionInStatusFlag, isDocumentRevisionObsolete } from '../../../../documentRevision/helpers/documentRevisionStatus';
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
  const passwordState = {
    status: AsyncStatus.Idle,
    message: '',
  };

  const warningState = {
    status: AsyncStatus.Idle,
    message: '',
  };

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const downloadAllAttachments = useActionCreator(attachmentsActions.downloadAllAttachments);
  const downloadSelectedAttachments = useActionCreator(attachmentsActions.downloadSelectedAttachments);
  const downloadAllAttachmentsPassword = useActionCreator(attachmentsActions.downloadAllAttachmentsPassword);
  const passwordDialogHandler = useDialog();
  const redlineWarningDialogHandler = useDialog();
  const selectedAttachmentsCount = Object.values(selectedAttachments ?? {}).filter(value => value === true).length;
  const attachments = selectedAttachments && Object.keys(selectedAttachments).filter(key => selectedAttachments[key]);
  const classes = useStyles();
  const { getFieldProps } = useFormikContext();
  const attachmentsData = (
    documentRevision?.attachments ?? getFieldProps('attachments').value ?? []
  ) as Attachment[];
  const isDownloadAll = selectedAttachmentsCount === 0 || selectedAttachmentsCount === attachmentsData?.length;

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      setIsDownloading(false);
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, '_parent');
    },
    onError: (message) => {
      setIsDownloading(false);
      message && toastError(message as unknown as string);
    },
  });

  const passwordSubmit = (values: Password) => {
    if (isDownloadAll) {
      async.start(downloadAllAttachmentsPassword, docRevId, async, values.password);
    } else {
      async.start(downloadSelectedAttachments, attachments, async);
    }
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

  const warningSubmit = () => {
    redlineWarningDialogHandler.close();
    passwordDialogHandler.open();
  };

  const handleAllDownload = (documentRevisionId: string, password: string | undefined) => () => {
    const isRedlineAttachmentExist = attachmentsData.filter(item => item.lineType === LINE_TYPES.RED_LINE);
    if (isDocumentRevisionInDraft(docRevStatus) && !isEmpty(isRedlineAttachmentExist) && (selectedAttachmentsCount === 1 || attachmentsData.length === 1)) {
      const attachments = attachmentsData.map(item => item.id);
      setIsDownloading(true);
      async.start(downloadSelectedAttachments, attachments, async);
    } else if (isDocumentRevisionInDraft(docRevStatus) || isUndefined(documentRevision?.attachments)) {
      setIsDownloading(true);
      async.start(downloadAllAttachments, documentRevisionId, async);
    } else if (!containsRedline && isDocumentRevisionInStatusFlag(docRevStatus)) {
      setIsDownloading(true);
      async.start(downloadAllAttachments, documentRevisionId, async);
    } else {
      setIsDownloading(true);
      redlineWarningDialogHandler.open();
    }
  };

  const handleSelectedDownload = (attachments: string[]) => () => {
    const isRedlineAttachmentExist = attachmentsData.filter(item => attachments.includes(item.id) && item.lineType === LINE_TYPES.RED_LINE);
    if (isDocumentRevisionInDraft(docRevStatus) || isEmpty(isRedlineAttachmentExist)) {
      setIsDownloading(true);
      async.start(downloadSelectedAttachments, attachments, async);
    } else if (isEmpty(isRedlineAttachmentExist) && isDocumentRevisionInStatusFlag(docRevStatus)) {
      setIsDownloading(true);
      async.start(downloadSelectedAttachments, attachments, async);
    } else if (!isEmpty(isRedlineAttachmentExist)) {
      setIsDownloading(true);
      redlineWarningDialogHandler.open();
    }
  };

  const closeDialog = () => {
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
        onSubmit={warningSubmit}
        closeDialog={closeDialog}
        asyncState={warningState}
        translationText={warningPasswordText()}
        translationButtonText="common.attachment.redline.warning.download.labelAll"
      />
      <PasswordDialog
        isDialogOpen={passwordDialogHandler.isOpen}
        onSubmit={passwordSubmit}
        closeDialog={passwordDialogHandler.close}
        asyncState={passwordState}
      />
      <Tooltip title={translate(isDownloadAll ? 'common.download.all.files' : 'common.download.selected.files')}>
        <IconButton
          className={classes.actionButton}
          onClick={isDownloadAll
            ? handleAllDownload(docRevId, undefined)
            : handleSelectedDownload(attachments ?? [])
          }
        >
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
