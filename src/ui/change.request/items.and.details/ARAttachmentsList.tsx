import React, { MouseEventHandler, useMemo } from 'react';
import { translate } from '../../../common/intl';
import { Attachment } from '../../../state/ducks/attachments/types';
import AttachmentField from '../../../ui/components/common/attachment.icon/container';
import Dialog from '../../components/dialogs';
import { EMPTY_VALUE_PLACEHOLDER } from '../../components/KendoDataGrid/constants';
import useDialog from '../../hooks/useDialog';
import LegacyThemeWrapper from '../../layout/theme/wrapper';
import FBAttachmentNamePresenter from '../FBMaterialDisposition/components/FBTasksListTable/components/FBAttachmentNamePresenter';
import useStyles from './ApprovalRequestGrid.styles';

const MAX_VISIBLE_ATTACHMENTS = 3;

interface ARAttachmentsListProps {
  attachments?: Attachment[]
  titleId?: string
}

const ARAttachmentsList: React.FC<ARAttachmentsListProps> = ({
  attachments = [],
  titleId,
}) => {
  const classes = useStyles();
  const attachmentsDialog = useDialog();

  const blockEditing: MouseEventHandler = (e) => e.stopPropagation();

  const orderedAttachments = useMemo(
    () => [...attachments].sort((a, b) => Number(a?.index) - Number(b?.index)),
    [attachments],
  );

  const visibleAttachments = orderedAttachments.slice(0, MAX_VISIBLE_ATTACHMENTS);
  const remainingAttachmentCount = orderedAttachments.length - visibleAttachments.length;
  const isExceedsMaxAttachments = orderedAttachments.length > MAX_VISIBLE_ATTACHMENTS;

  if (!visibleAttachments.length) {
    return <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  return (
    <div onClick={blockEditing}>
      <FBAttachmentNamePresenter
        boxProps={{ className: classes.attachmentsList }}
        attachments={visibleAttachments}
        isDisabled
      />
      {isExceedsMaxAttachments && (
        <span
          onClick={attachmentsDialog.open}
          className={classes.allAttachments}
        >
          {translate('document.revision.view.more')} ({remainingAttachmentCount})
        </span>
      )}
      <Dialog
        title={translate('ar.attachment.dialog.title', { titleId })}
        open={attachmentsDialog.isOpen}
        onClose={attachmentsDialog.close}
        fullWidth
        maxWidth="lg"
      >
        <div className={classes.attachmentsDialogContainer}>
          <LegacyThemeWrapper>
            <AttachmentField
              value={orderedAttachments}
              name="arAttachments"
              preserveOrder
            />
          </LegacyThemeWrapper>
        </div>
      </Dialog>
    </div>
  );
};

export default ARAttachmentsList;
