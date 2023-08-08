import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import FBBOMDetailDrawer from '../../drawer';
import { ALTERNATE_PARTS_COUNT_KEY, SELECTED_PART_KEY_SEPARATOR } from '../constants';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

export const AlternatePartsCell: React.FC<CustomTreeListCellProps> | undefined = ({
  dataItem,
  field,
  colSpan,
  className,
  style,
}) => {
  const classes = styles();
  const alternatePartsCount = dataItem[ALTERNATE_PARTS_COUNT_KEY] ?? 0;
  const isAlteratePartsExists = alternatePartsCount > 0;
  const handleToggle = () => {
    setOpenPartsDrawer(true);
  };
  const [openPartsDrawer, setOpenPartsDrawer] = React.useState(false);

  const closeDrawer = () => {
    setOpenPartsDrawer(false);
  };

  const fetchDotIcon = () => <FontAwesomeIcon
    icon={isAlteratePartsExists ? solid('circle') : regular('circle')}
    className={cx(classes.dot, { selectedDot: isAlteratePartsExists, deselectedDot: !isAlteratePartsExists })}
  />;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx(className, classes.cellborderBottom)}
    >
      <div onClick={handleToggle}>
        <Tooltip
          title={alternatePartsCount}
          placement="top"
          arrow
          hidden={!isAlteratePartsExists}
        >
          {fetchDotIcon()}
        </Tooltip>
        {!isAlteratePartsExists && fetchDotIcon()}
      </div>
      <FBBOMDetailDrawer {...{ openDrawer: openPartsDrawer, closeDrawer, parentRevId: dataItem.id.split(SELECTED_PART_KEY_SEPARATOR)[0], revision: dataItem.revision, status: dataItem.status, docId: dataItem.docId }} />
    </td>
  );
};
