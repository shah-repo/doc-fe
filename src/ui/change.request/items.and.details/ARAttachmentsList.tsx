import React, { MouseEventHandler } from 'react';
import { translate } from '../../../common/intl';
import { LINE_TYPES } from '../../../state/ducks/attachments/constants';
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

  const [sortedAttachments, setAttachmentsData] = React.useState<Attachment[]>([]);

  const sortAttachments = (attachments: Attachment[]) => {
    return [...attachments].sort((a, b) => {
      const isARedLine = a.lineType === LINE_TYPES.RED_LINE;
      const isBRedLine = b.lineType === LINE_TYPES.RED_LINE;

      if (isARedLine !== isBRedLine) {
        return isARedLine ? -1 : 1;
      }

      return Number(a.index) - Number(b.index);
    });
  };

  React.useEffect(() => {
    setAttachmentsData(sortAttachments(attachments));
  }, [attachments]);

  const visibleAttachments = sortedAttachments.slice(0, MAX_VISIBLE_ATTACHMENTS);
  const remainingAttachmentCount = sortedAttachments.length - visibleAttachments.length;
  const isExceedsMaxAttachments = sortedAttachments.length > MAX_VISIBLE_ATTACHMENTS;

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
              value={attachments}
              name="arAttachments"
              isRedlineFirst
            />
          </LegacyThemeWrapper>
        </div>
      </Dialog>
    </div>
  );
};

export default ARAttachmentsList;
