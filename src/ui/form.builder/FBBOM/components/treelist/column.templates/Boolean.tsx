import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import React from 'react';
import FBBOMDetailDrawer from '../../drawer/VendorDrawer';
import { ALTERNATE_PART_KEY, SELECTED_PART_KEY_SEPARATOR } from '../constants';
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
    if (field === ALTERNATE_PART_KEY) {
      setIsPartsDrawerOpened(true);
    }
  };
  const [isPartsDrawerOpened, setIsPartsDrawerOpened] = React.useState(false);

  const closeDrawer = () => {
    setIsPartsDrawerOpened(false);
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx(className, classes.cellborderBottom)}
      data-cy="cell-boolean"
    >
      <div onClick={flag ? handleToggle : handleToggle}>
        <FontAwesomeIcon
          icon={flag ? solid('circle') : regular('circle')}
          className={cx(classes.dot, { selectedDot: flag, deselectedDot: !flag })}
        />
      </div>
      <FBBOMDetailDrawer {...{ isDrawerOpened: isPartsDrawerOpened, closeDrawer, parentRevId: dataItem.id?.split(SELECTED_PART_KEY_SEPARATOR)[0], revision: dataItem.revision, status: dataItem.status, docId: dataItem.docId }} />
    </td>
  );
};
