import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, MenuItem } from '@material-ui/core';
import cx from 'classnames';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { translate } from '../../../../../common/intl';
import { LINE_TYPES } from '../../../../../state/ducks/attachments/constants';
import { AttachmentType } from '../../../../../state/ducks/attachments/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { Attachment } from '../../../../change.request/form/types';
import { FormHeaderSummaryContext } from '../../../../document.revision/header/SummaryHeader';
import { documentRevisionStatusContextFromDocList } from '../../../../documentRevision/DocumentRevisionsManager.container';
import { FormHeaderContext, isOwnerContext } from '../../../../documentRevision/forms/DocumentRevisionForm.container';
import { isDocumentRevisionDeprecated, isDocumentRevisionInStatus, isDocumentRevisionObsolete } from '../../../../documentRevision/helpers/documentRevisionStatus';
import { CellTemplateProps } from '../../../KendoDataGrid/KendoDataGrid.types';
import Text from '../../../Text';
import MenuItemSetPrimary from '../../attachment.icon/menu.setPrimary';
import HeaderMenu from '../../header/Menu';
import { WATERMARK_FILES } from '../../view.file/utils/constants';
import { checkIfFileIsViewable } from '../../view.file/utils/helpers';
import { useStyles } from '../styles';

interface Props extends CellTemplateProps<Attachment> {
  documentRevision?: DocumentRevision
  onDownloadAttachment?: (attachment: Attachment, type?: AttachmentType) => void
  onDownloadAsPDF?: (attachment: Attachment, attachmentType: AttachmentType, documentRevisionId?: string) => void
  onView?: (attachment: Attachment) => (evt: React.MouseEvent<HTMLElement>) => void
  onDelete?: (attachment: Attachment) => () => void
}

const ActionNeededCellTemplate: React.FC<Props> = (props) => {
  const { dataItem: attachment, documentRevision, onDownloadAttachment, onDownloadAsPDF, onView, onDelete } = props;
  const classes = useStyles();
  const type = get(attachment, 'type') as AttachmentType;
  const isFileViewable = useMemo(() => checkIfFileIsViewable(type), [type]);
  const { documentRevisionSummary } = React.useContext(FormHeaderSummaryContext) || {};
  const documentRevisionStatusFromDocList = React.useContext(documentRevisionStatusContextFromDocList);
  const id = isDocumentRevisionObsolete(documentRevisionStatusFromDocList) || isDocumentRevisionDeprecated(documentRevisionStatusFromDocList)
    ? documentRevisionSummary?.id as string
    : undefined;

  const requiredStatus = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Draft, DocumentRevisionStatus.PendingChange],
    documentRevision?.status,
  );
  const canSetAsPrimary = requiredStatus && documentRevision?.document?.canAccess && attachment.lineType !== LINE_TYPES.RED_LINE;
  const isDocumentPage = Boolean(React.useContext(FormHeaderContext));
  const isNewDocument = isDocumentPage && !documentRevision?.id;
  const showSetAsPrimary = attachment.id !== documentRevision?.primaryAttachment?.id && canSetAsPrimary && !isNewDocument && isDocumentPage;
  const isUserDocumentOwner = React.useContext(isOwnerContext);
  const canWatermark = useMemo(() => WATERMARK_FILES.includes(type), [type]);

  return (
    <HeaderMenu
      columnMenuItemClasses={cx('k-grid-columnmenu-popup', classes.columnMenuItem)}
      menuIconButtonClass={classes.iconButton}
      icon={<FontAwesomeIcon className={cx('k-icon', classes.icon)} icon={solid('ellipsis-vertical')} />}
    >
      <MenuItem onClick={() => onDownloadAttachment?.(attachment)}>
        <FontAwesomeIcon icon={regular('arrow-down-to-line')} className={classes.menuIcons} />
        <Text message={translate('attachment.menu.download.file')} />
      </MenuItem>
      {canWatermark && (
        <MenuItem onClick={() => onDownloadAsPDF?.(attachment, AttachmentType.Attached, id)}>
          <FontAwesomeIcon icon={regular('file-lines')} className={classes.menuIcons} />
          <Text message={translate('attachment.menu.download.as.pdf')} />
        </MenuItem>
      )}
      {isFileViewable && (
        <MenuItem onClick={onView?.(attachment)}>
          <FontAwesomeIcon icon={regular('eye')} className={classes.menuIcons} />
          <Text message={translate('attachment.menu.view')} />
        </MenuItem>
      )}
      {isUserDocumentOwner && requiredStatus && (
        <MenuItem onClick={onDelete?.(attachment)}>
          <FontAwesomeIcon icon={regular('trash-can')} className={cx(classes.menuIcons, classes.menuDeleteIcon)} />
          <Text message={translate('common.delete')} />
        </MenuItem>
      )}
      {showSetAsPrimary && !isNewDocument && (
        <>
          <Divider />
          <MenuItemSetPrimary {...{ attachment, documentRevision }} />
        </>
      )}
    </HeaderMenu>
  );
};

export default ActionNeededCellTemplate;
