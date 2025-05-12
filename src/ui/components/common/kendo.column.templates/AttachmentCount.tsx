import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import cx from 'classnames';
import { get } from 'lodash';
import React from 'react';
import { CustomGridCellProps } from '../kendo/types';
import useStyles from './AttachmentCount.styles';

interface DotIconProps {
  isSelected: boolean
  className: string
}

const DotIcon: React.FC<DotIconProps> = ({ isSelected, className }) => (
  <FontAwesomeIcon
    icon={isSelected ? solid('circle') : regular('circle')}
    className={cx(className, {
      selectedDot: isSelected,
      deselectedDot: !isSelected,
    })}
  />
);

export const AttachmentCount: React.FC<CustomGridCellProps> = ({
  dataItem,
  field = '',
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const classes = useStyles();

  if (rowType === 'groupHeader') return null;

  const attachmentLength = get(dataItem, field ?? '', 0) as number;
  const isAttachmentsExist = attachmentLength > 0;
  const handleClick = () => cellRowClick?.({ dataItem });

  return (
    <td
      colSpan={colSpan}
      style={{ ...style, textAlign: 'right' }}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={handleClick}
    >
      <Grid container alignItems="center">
        <Tooltip title={attachmentLength} placement="top" arrow>
          <DotIcon isSelected={isAttachmentsExist} className={classes.dot} />
        </Tooltip>
      </Grid>
    </td>
  );
};
