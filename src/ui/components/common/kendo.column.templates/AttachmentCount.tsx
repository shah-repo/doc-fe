import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import cx from 'classnames';
import { get } from 'lodash';
import React, { useCallback } from 'react';
import { CustomGridCellProps } from '../kendo/types';
import useStyles from './AttachmentCount.styles';

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

  const classes = useStyles();
  const attachmentLength = get(dataItem, field, 0) as number;
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
