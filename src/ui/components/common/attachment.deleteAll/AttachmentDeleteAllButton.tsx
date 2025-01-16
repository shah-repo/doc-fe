import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core';
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
  selectedAttachments: {[id: string]: boolean | number[]}
  documentRevision: DocumentRevision
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      verticalAlign: 'middle',
      maxHeight: '20px',
      maxWidth: '20px',
    },
    deleteButton: {
      padding: 0,
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    deleteIcon: {
      color: Colors.red,
      height: 17,
      width: 17,
    },
  }));

const AttachmentDeleteAllButton: React.FunctionComponent<Props> = ({
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

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const downloadAllAttachments = useActionCreator(attachmentsActions.downloadAllAttachments);
  const downloadAllAttachmentsPassword = useActionCreator(attachmentsActions.downloadAllAttachmentsPassword);
  const passwordDialogHandler = useDialog();
  const redlineWarningDialogHandler = useDialog();
  const selectedAttachmentsCount = Object.values(selectedAttachments).filter(value => value === true).length;

  const classes = styles({ isAttachmentEmpty });

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      setIsDeleting(false);
      window.onbeforeunload = null;
      downloadInfo && window.open(downloadInfo.url, '_parent');
    },
    onError: (message) => {
      setIsDeleting(false);
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

  const handleAllDelete = (documentRevisionId: string, password: string | undefined) => () => {
    if (isDocumentRevisionInDraft(docRevStatus)) {
      setIsDeleting(true);
      async.start(downloadAllAttachments, documentRevisionId, async);
    } else if (!containsRedline && isDocumentRevisionInStatusFlag(docRevStatus)) {
      setIsDeleting(true);
      async.start(downloadAllAttachments, documentRevisionId, async);
    } else {
      setIsDeleting(true);
      redlineWarningDialogHandler.open();
    }
  };

  const closeDialog = () => {
    redlineWarningDialogHandler.close();
    setIsDeleting(false);
  };

  const toolTipText = selectedAttachmentsCount === 0 || selectedAttachmentsCount === documentRevision.attachments.length ? 'common.delete.all.files' : 'common.delete.selected.files';

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
      <IconButton onClick={() => handleAllDelete} className={classes.deleteButton}>
        {isDeleting ? <CircularProgress className={classes.icon} /> : null}
        <FontAwesomeIcon icon={regular('trash-can')} className={classes.deleteIcon} />
      </IconButton>
      </Tooltip>
    </>
  );
};

export default AttachmentDeleteAllButton;
