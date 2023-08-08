import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { attachmentColorByType } from '../../../../../components/common/attachment.icon/attachmentColorByType';
import { renderPrimaryAttachment } from '../../../../../components/common/attachment.icon/attachmentIcons';
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
  const extension = s3link.substring(s3link.lastIndexOf('.') + 1, s3link.length);
  const fileName = s3link.substring(s3link.lastIndexOf('/') + 1);
  const color = attachmentColorByType[extension?.toUpperCase()] as string;

  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={cx(className, classes.cellborderBottom)}
  >
    {extension && <Tooltip
      title={fileName}
      placement="top"
      arrow
    >
      {renderPrimaryAttachment(color, extension, 27, 27)}
    </Tooltip>}
  </td>;
};
