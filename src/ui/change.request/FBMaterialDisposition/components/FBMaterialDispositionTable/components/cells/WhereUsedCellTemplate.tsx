import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import { GridCellProps } from '@progress/kendo-react-grid';
import cx from 'classnames';
import React from 'react';
import { styles } from './styles';

export const WhereUsedCellTemplate: React.FunctionComponent<GridCellProps> = ({ dataItem, field, colSpan, className, style, ...props }) => {
  const classes = styles();
  const whereUsedLength = (dataItem[field ?? ''] ?? 0) as number;
  const isWhereUsedExist = whereUsedLength > 0;

  const handleClick = () => {
    // To Do to Open Modal
  };

  const fetchDotIcon = () => <FontAwesomeIcon
    icon={isWhereUsedExist ? solid('circle') : regular('circle')}
    className={cx(classes.dot, { [classes.selectedDot]: isWhereUsedExist, [classes.deselectedDot]: !isWhereUsedExist })}
  />;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx(className, classes.contentCenter)}
      data-cy="where-used"
    >
      <div
        onClick={handleClick}
      >
        <Tooltip
          title={whereUsedLength}
          placement="top"
          arrow
          hidden={!isWhereUsedExist}
        >
          {fetchDotIcon()}
        </Tooltip>
        {!isWhereUsedExist && fetchDotIcon()}
      </div>
    </td>
  );
};
