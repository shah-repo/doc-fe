import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import VendorDrawer from '../../drawer/VendorDrawer';
import { SELECTED_PART_KEY_SEPARATOR } from '../constants';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

export const VendorsCell: React.FC<CustomTreeListCellProps> | undefined = ({
  dataItem,
  field,
  colSpan,
  className,
  style,
}) => {
  const classes = styles();
  const suppliersLength = (dataItem[field ?? ''] ?? 0) as number;
  const isSuppliersExist = suppliersLength > 0;
  const handleClick = () => {
    if (isSuppliersExist) {
      setIsPartsDrawerOpened(true);
    }
  };
  const [isPartsDrawerOpened, setIsPartsDrawerOpened] = React.useState(false);

  const closeDrawer = () => {
    setIsPartsDrawerOpened(false);
  };
  const fetchDotIcon = () => <FontAwesomeIcon
    icon={isSuppliersExist ? solid('circle') : regular('circle')}
    className={cx(classes.dot, { selectedDot: isSuppliersExist, deselectedDot: !isSuppliersExist })}
  />;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx(className, classes.cellborderBottom)}
    >
      <div onClick={handleClick}>
        <Tooltip
          title={suppliersLength}
          placement="top"
          arrow
          hidden={!isSuppliersExist}
        >
          {fetchDotIcon()}
        </Tooltip>
        {!isSuppliersExist && fetchDotIcon()}
      </div>
      <VendorDrawer {...{
        openDrawer: isPartsDrawerOpened,
        closeDrawer,
        parentRevId: dataItem.id.split(SELECTED_PART_KEY_SEPARATOR)[0],
        revision: dataItem.revision,
        status: dataItem.status,
        docId: dataItem.docId,
        vendors: dataItem.vendors ?? [],
      }} />
    </td>
  );
};
