import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { SM } from '../../../../../../App';
import FBBOMDetailDrawer from '../../drawer/AlternateParts';
import DocumentRevisionDrawerContent from '../../drawer/DocumentRevisionDrawer';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const AttachmentCell: React.FC<CustomTreeListCellProps> | undefined = ({
  dataItem,
  field,
  colSpan,
  className,
  style,
}) => {
  const classes = styles();
  const [isPartsDrawerOpened, setIsPartsDrawerOpened] = React.useState(false);
  const attachmentNamesCount = dataItem.attachmentNames?.length ?? 0;
  const isAttachmentNamesExists = attachmentNamesCount > 0;
  const { _documentRevisionFormState } = SM.useStores();

  const openDrawer = () => {
    if (!dataItem.isDisabled) {
      _documentRevisionFormState?.setRefreshBOMTree(false);
    }
    setIsPartsDrawerOpened(true);
  };
  const closeDrawer = () => {
    if (!dataItem.isDisabled) {
      _documentRevisionFormState?.setRefreshBOMTree(!_documentRevisionFormState?.refreshBOMTree);
    }
    setIsPartsDrawerOpened(false);
  };

  const fetchDotIcon = () => <FontAwesomeIcon
    icon={isAttachmentNamesExists ? solid('circle') : regular('circle')}
    className={cx(classes.dot, { selectedDot: isAttachmentNamesExists, deselectedDot: !isAttachmentNamesExists })}
  />;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx(className, classes.cellborderBottom)}
      data-cy="cell-attachment"
    >
      <div onClick={isAttachmentNamesExists ? openDrawer : undefined}>
        <Tooltip
          title={attachmentNamesCount}
          placement="top"
          arrow
          hidden={!isAttachmentNamesExists}
        >
          {fetchDotIcon()}
        </Tooltip>
        {!isAttachmentNamesExists && fetchDotIcon()}
      </div>
      <FBBOMDetailDrawer {...{ isDrawerOpened: isPartsDrawerOpened, closeDrawer, dataItem }} >
        <DocumentRevisionDrawerContent {...{ dataItem, closeDrawer }} />
      </FBBOMDetailDrawer>
    </td>
  );
};

export default AttachmentCell;
