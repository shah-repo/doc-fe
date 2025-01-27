import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, createStyles, Link, makeStyles, Theme, Tooltip } from '@material-ui/core';
import React, { useState } from 'react';
import { translate } from '../../../../common/intl';
import { attachmentsActions } from '../../../../state/ducks/attachments';
import { AttachmentDownloadResponse } from '../../../../state/ducks/attachments/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../state/ducks/documentRevisions/types';
import { AsyncStatus } from '../../../../state/types';
import { isDocumentRevisionDeprecated, isDocumentRevisionInDraft, isDocumentRevisionInStatusFlag, isDocumentRevisionObsolete } from '../../../documentRevision/helpers/documentRevisionStatus';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import useDialog from '../../../hooks/useDialog';
import Colors from '../../../layout/theme/utils/colors';
import { Translation } from '../../../translations/types';
import { toastError } from '../../notifications';
import PasswordDialog from '../../password/dialog';
import { Password } from '../../password/types';
import AttachmentRedLineWarningDialog from '../attachment.redline.warning/dialog';

interface Props {
  isAttachmentEmpty: boolean
  docRevId: string
  containsRedline: boolean
  docRevStatus: DocumentRevisionStatus
  selectedAttachments?: {[id: string]: boolean | number[]}
  documentRevision?: DocumentRevision
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      verticalAlign: 'middle',
      maxHeight: '20px',
      maxWidth: '20px',
    },
    link: {
      cursor: 'pointer',
      color: Colors.font_gray,
      marginLeft: theme.spacing(1),
    },
    downloadIcon: {
      height: 18,
      width: 18,
    },
  }));

const AttachmentDownloadAllButton: React.FunctionComponent<Props> = ({
  isAttachmentEmpty,
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
  const selectedAttachmentsCount = Object.values(selectedAttachments || {}).filter(value => value === true).length;
  const attachments = selectedAttachments && Object.keys(selectedAttachments).filter(key => selectedAttachments[key]);
  const classes = styles({ isAttachmentEmpty });

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
    async.start(downloadAllAttachmentsPassword, docRevId, async, values.password);
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
    if (isDocumentRevisionInDraft(docRevStatus)) {
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

  const handleSelectedDownload = (documentRevisionId: string, attachments: string[], password: string | undefined) => () => {
    if (isDocumentRevisionInDraft(docRevStatus)) {
      setIsDownloading(true);
      async.start(downloadSelectedAttachments, documentRevisionId, attachments, async);
    } else if (!containsRedline && isDocumentRevisionInStatusFlag(docRevStatus)) {
      setIsDownloading(true);
      async.start(downloadSelectedAttachments, documentRevisionId, attachments, async);
    } else {
      setIsDownloading(true);
      redlineWarningDialogHandler.open();
    }
  };

  const closeDialog = () => {
    redlineWarningDialogHandler.close();
    setIsDownloading(false);
  };

  const toolTipText = selectedAttachmentsCount === 0 || selectedAttachmentsCount === documentRevision?.attachments?.length ? 'common.download.all.files' : 'common.download.selected.files';

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
      <Tooltip title={translate(toolTipText)}>
      <label
        htmlFor="button-file"
        onClick={selectedAttachmentsCount === 0 || selectedAttachmentsCount === documentRevision?.attachments?.length ? handleAllDownload(docRevId, undefined) : handleSelectedDownload(docRevId, attachments ?? [], undefined)}>
        <Link
          className={classes.link}
          component="span"
          variant="button"
          id="AttachmentFieldPresenter-downloadAllButton"
        >
          {isDownloading ? <CircularProgress className={classes.icon} /> : <FontAwesomeIcon icon={regular('arrow-down-to-line')} className={classes.downloadIcon} />}
        </Link>
      </label>
      </Tooltip>
    </>
  );
};

export default AttachmentDownloadAllButton;
