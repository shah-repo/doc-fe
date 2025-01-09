import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem } from '@material-ui/core';
import cx from 'classnames';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { translate } from '../../../../../common/intl';
import { AttachmentType } from '../../../../../state/ducks/attachments/types';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { Attachment } from '../../../../change.request/form/types';
import { FormHeaderSummaryContext } from '../../../../document.revision/header/SummaryHeader';
import { documentRevisionStatusContextFromDocList } from '../../../../documentRevision/DocumentRevisionsManager.container';
import Text from '../../../Text';
import HeaderMenu from '../../header/Menu';
import { checkIfFileIsViewable } from '../../view.file/utils/helpers';
import useStyles from '../styles';

const ActionNeededCellTemplate: React.FC<any> = (props) => {
  const { onDownloadAttachment, onDownloadAsPDF, onView, onDelete, dataItem } = props;
  const type = get(dataItem, 'type') as AttachmentType;
  const isFileViewable = useMemo(() => checkIfFileIsViewable(type), [type]);
  const attachment = dataItem as Attachment;
  const { documentRevisionSummary } = React.useContext(FormHeaderSummaryContext) || {};
  const documentRevisionStatusFromDocList = React.useContext(documentRevisionStatusContextFromDocList);
  const id = documentRevisionStatusFromDocList === DocumentRevisionStatus.Obsolete
  || documentRevisionStatusFromDocList === DocumentRevisionStatus.Deprecated ? documentRevisionSummary?.id as string : undefined;
  console.log('----attachement---', { dataItem, type, onView, onDelete, isFileViewable });
  const classes = useStyles();

  return (
    <HeaderMenu
        columnMenuItemClasses={cx('k-grid-columnmenu-popup', classes.columnMenuItem)}
        menuIconButtonClass={classes.iconButton}
        icon={<FontAwesomeIcon className={cx('k-icon', classes.icon)} icon={solid('ellipsis-vertical')} />}
      >
        <MenuItem onClick={() => onDownloadAttachment(attachment)}>
          <FontAwesomeIcon icon={regular('arrow-down-to-line')} className={classes.menuIcons} />
          <Text message={translate('attachment.menu.download.file')} />
        </MenuItem>
        <MenuItem onClick={() => onDownloadAsPDF(attachment, AttachmentType.Attached, id)}>
          <FontAwesomeIcon icon={regular('file-lines')} className={classes.menuIcons} />
          <Text message={translate('attachment.menu.download.as.pdf')} />
        </MenuItem>
        {isFileViewable && (
          <MenuItem onClick={onView(attachment)}>
          <FontAwesomeIcon icon={regular('eye')} className={classes.menuIcons} />
          <Text message={translate('attachment.menu.view')} />
          </MenuItem>
        )}
        <MenuItem onClick={onDelete(attachment)}>
          <FontAwesomeIcon icon={regular('trash-can')} className={cx(classes.menuIcons, classes.menuDeleteIcon)} />
          <Text message={translate('attachment.menu.delete')} />
        </MenuItem>
      </HeaderMenu>
  );
};

export default ActionNeededCellTemplate;
