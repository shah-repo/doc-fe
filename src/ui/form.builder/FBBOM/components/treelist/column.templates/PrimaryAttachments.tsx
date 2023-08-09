import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { attachmentsActions } from '../../../../../../state/ducks/attachments';
import { AttachmentDownloadResponse } from '../../../../../../state/ducks/attachments/types';
import { attachmentColorByType } from '../../../../../components/common/attachment.icon/attachmentColorByType';
import { renderPrimaryAttachment } from '../../../../../components/common/attachment.icon/attachmentIcons';
import ViewFile from '../../../../../components/common/view.file/container';
import { checkIfFileIsViewable } from '../../../../../components/common/view.file/utils/helpers';
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
  const s3link = dataItem.primaryAttachmentDetails?.s3link ?? '';
  const type = dataItem.primaryAttachmentDetails?.type ?? '';
  const fileName = s3link.substring(s3link.lastIndexOf('/') + 1);

  const color = attachmentColorByType[type?.toUpperCase()] as string;

  const dialogHandler = useDialog();
  const async = useAsync<AttachmentDownloadResponse>({
    onSuccess: (downloadInfo) => {
      console.log('success');
    },
  });
  const downloadAttachment = useActionCreator(attachmentsActions.download);
  const downloadOrViewFile = () => {
  //   // TODO
    if (checkIfFileIsViewable(dataItem?.primaryAttachmentDetails?.type)) {
      dialogHandler.open();
      console.log('ataItem.primaryAttachmentDetails :', dataItem.primaryAttachmentDetails);
    } else {
      // download file
      // handleDownload(dataItem.primaryAttachmentDetails);
      async.start(downloadAttachment, dataItem.primaryAttachmentDetails, async, dataItem.primaryAttachmentDetails?.type);
    }
  };

  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={cx(className, classes.cellborderBottom)}
  >
    {type && <Tooltip
      title={fileName}
      placement="top"
      arrow
    >
      <span onClick={downloadOrViewFile}>
        {renderPrimaryAttachment(color, type, 27, 27)}
      </span>
    </Tooltip>}
    {dataItem.primaryAttachmentDetails && <ViewFile
      isOpen={dialogHandler.isOpen}
      handleClose={dialogHandler.close}
      password={undefined}
      attachments={[dataItem.primaryAttachmentDetails]}
      attachment={dataItem.primaryAttachmentDetails}
    />}
  </td>;
};
