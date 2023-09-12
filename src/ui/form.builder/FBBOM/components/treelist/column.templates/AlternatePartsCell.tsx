import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { SM } from '../../../../../../App';
import AlternatePartsDrawer from '../../drawer/AlternateParts';
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
  const { _documentRevisionFormState } = SM.useStores();
  const handleToggle = () => {
    if (!dataItem.isDisabled) {
    _documentRevisionFormState?.setRefreshBOMTree(false);
    }
    setIsDrawerOpened(true);
  };
  const [isDrawerOpened, setIsDrawerOpened] = React.useState(false);

  const closeDrawer = () => {
    setIsDrawerOpened(false);
    if (!dataItem.isDisabled) {
      _documentRevisionFormState?.setRefreshBOMTree(!_documentRevisionFormState?.refreshBOMTree);
    }
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
      <AlternatePartsDrawer {...{ isDrawerOpened, closeDrawer, parentRevId: dataItem.id.split(SELECTED_PART_KEY_SEPARATOR)[0], revision: dataItem.displayRevision, status: dataItem.displayStatus, docId: dataItem.docId }} />
    </td>
  );
};
