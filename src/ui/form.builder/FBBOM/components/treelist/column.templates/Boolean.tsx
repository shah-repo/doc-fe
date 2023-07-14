import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React from 'react';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

export const BooleanCell: React.FC<CustomTreeListCellProps> | undefined = ({
  dataItem,
  field,
  colSpan,
  className,
  style,
}) => {
  const classes = styles();
  const flag = dataItem[field ?? ''] as boolean;
  const handleToggle = () => {
    // TODO open side bar
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx(className, classes.cellborderBottom)}
    >
      <div onClick={flag ? handleToggle : undefined}>
        <FontAwesomeIcon
          icon={flag ? solid('circle') : regular('circle')}
          className={cx(classes.dot, { selectedDot: flag, deselectedDot: !flag })}
        />
      </div>
    </td>
  );
};
