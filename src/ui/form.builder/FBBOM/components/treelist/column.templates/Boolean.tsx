import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React, { useState } from 'react';
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
  const [isChecked, setIsChecked] = useState(flag);
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
    >
      <div onClick={handleToggle}>
        <FontAwesomeIcon
          icon={isChecked ? solid('circle') : regular('circle')}
          className={cx(classes.dot, { selectedDot: isChecked, deselectedDot: !isChecked })}
        />
      </div>
    </td>
  );
};
