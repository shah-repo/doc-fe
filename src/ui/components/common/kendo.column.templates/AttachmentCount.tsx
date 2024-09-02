import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React, { useCallback } from 'react';
import { CustomGridCellProps } from '../kendo/types';
import styles from './AttachmentCount.styles';

export const AttachmentCount: React.FunctionComponent<CustomGridCellProps> = ({
  dataItem,
  field = '',
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  if (rowType === 'groupHeader') {
    return null;
  }

  const classes = styles();
  const attachmentLength = (dataItem[field ?? ''] ?? 0) as number;
  const isAttachmentsExist = attachmentLength > 0;
  const cellClickEvent = () => cellRowClick?.({ dataItem });

  const getDotIcon = useCallback(
    () => (
      <FontAwesomeIcon
        icon={isAttachmentsExist ? solid('circle') : regular('circle')}
        className={cx(classes.dot, {
          selectedDot: isAttachmentsExist,
          deselectedDot: !isAttachmentsExist,
        })}
      />
    ),
    [isAttachmentsExist, classes.dot],
  );

  return (
    <td
      colSpan={colSpan}
      style={{ ...style, textAlign: 'right' }}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
      >
        {isAttachmentsExist ? (
          <Tooltip title={attachmentLength} placement="top" arrow>
            {getDotIcon()}
          </Tooltip>
        ) : (
          getDotIcon()
        )}
      </Grid>
    </td>
  );
};
