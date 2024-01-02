import { CircularProgress, Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { attachmentsActions } from '../../../../../../state/ducks/attachments';
import { AttachmentDownloadResponse } from '../../../../../../state/ducks/attachments/types';
import { downloadFile } from '../../../../../common/utils/helpers';
import { attachmentColorByType } from '../../../../../components/common/attachment.icon/attachmentColorByType';
import { renderPrimaryAttachment } from '../../../../../components/common/attachment.icon/attachmentIcons';
import ViewFile from '../../../../../components/common/view.file/container';
import { checkIfFileIsViewable } from '../../../../../components/common/view.file/utils/helpers';
import { toastError } from '../../../../../components/notifications';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import useDialog from '../../../../../hooks/useDialog';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

export const PrimaryAttachmentsCell: React.FC<CustomTreeListCellProps> = ({
  dataItem,
  colSpan,
  style,
  className,
}) => {
  const classes = styles();
  const primaryAttachmentDeails = dataItem.primaryAttachmentDetails;
  const s3link = primaryAttachmentDeails?.s3link ?? '';
  const type = primaryAttachmentDeails?.type ?? '';
  const fileName = s3link.substring(s3link.lastIndexOf('/') + 1);
  const color = attachmentColorByType[type?.toUpperCase()] as string;
  const dialogHandler = useDialog();
  const downloadAttachment = useActionCreator(attachmentsActions.download);

  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      window.onbeforeunload = null;
      downloadFile(downloadInfo?.url);
    },
    onError: (message) => {
      message && toastError(message);
    },
  });

  const downloadOrViewFile = () => {
    if (checkIfFileIsViewable(dataItem?.primaryAttachmentDetails?.type)) {
      dialogHandler.open();
    } else {
      async.start(downloadAttachment, primaryAttachmentDeails, async);
    }
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx(className, classes.cellborderBottom)}
      data-cy="cell-primary-attachment"
    >
      {type && (
        <Tooltip title={fileName} placement="top" arrow>
          <span onClick={downloadOrViewFile} className={classes.attachmentContainer}>
            {async.isLoading && (
              <CircularProgress className={classes.progress} />
            )}
            {!async.isLoading && renderPrimaryAttachment(color, type, 27, 27)}
          </span>
        </Tooltip>
      )}
      {primaryAttachmentDeails && (
        <ViewFile
          isOpen={dialogHandler.isOpen}
          handleClose={dialogHandler.close}
          attachments={[primaryAttachmentDeails]}
          attachment={primaryAttachmentDeails}
        />
      )}
    </td>
  );
};
