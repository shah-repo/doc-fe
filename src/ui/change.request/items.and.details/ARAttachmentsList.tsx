import React from 'react';
import { intl } from '../../../common/intl';
import { LINE_TYPES } from '../../../state/ducks/attachments/constants';
import { Attachment } from '../../../state/ducks/attachments/types';
import { Button } from '../../components/forms/fields-next';
import { FB, FBFileUploadState, FBProvider } from '../../form.builder';
import useDialog from '../../hooks/useDialog';
import FBAttachmentNamePresenter from '../FBMaterialDisposition/components/FBTasksListTable/components/FBAttachmentNamePresenter';
import useStyles from './ApprovalRequestGrid.styles';
import ARAttachmentDialog from './ARAttachmentDialog';

interface ARAttachmentsListProps {
  attachments: Attachment[] | undefined
  titleId?: string
}
const MAX_VISIBLE_ATTACHMENTS = 3;

const ARAttachmentsList: React.FC<ARAttachmentsListProps> = ({
  attachments,
  titleId,
}) => {
  const classes = useStyles();
  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
  const viewMore = intl.formatMessage({ id: 'document.revision.view.more' });
  const title = intl.formatMessage({ id: 'ar.attachment.dialog.title' }, { titleId });
  const arAttachmentDialog = useDialog();
  const toggleShowAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    arAttachmentDialog.open();
  };

  const sortedAttachments = (attachments || []).sort((a, b) => {
    if (a.lineType === LINE_TYPES.RED_LINE && b.lineType !== LINE_TYPES.RED_LINE) return -1;
    if (a.lineType !== LINE_TYPES.RED_LINE && b.lineType === LINE_TYPES.RED_LINE) return 1;
    return 0;
  });

  const visibleAttachments = sortedAttachments.slice(0, MAX_VISIBLE_ATTACHMENTS);
  const remainingAttachmentCount = sortedAttachments.length - visibleAttachments.length;
  const exceedsMaxAttachments = sortedAttachments.length > MAX_VISIBLE_ATTACHMENTS;

  return (
    <>
      <FBProvider {...{ fileUploadState }}>
        <div className={classes.attachmentsList}>
          {visibleAttachments?.map((attachment) => (
            <FBAttachmentNamePresenter
              key={attachment.id}
              boxProps={{ className: classes.attachmentsContainer }}
              attachments={[attachment]}
              fileUploadState={fileUploadState}
              isDisabled={true}
            />
          ))}
        </div>
      </FBProvider>
      {exceedsMaxAttachments && (
        <Button
          variant="text"
          onClick={e => toggleShowAll(e)}
          className={classes.moreOrLess}>
          {`${viewMore} (${remainingAttachmentCount})`}
        </Button>
      )}
      <ARAttachmentDialog
        title={title}
        handler={arAttachmentDialog}
        loading={false}
        attachments={sortedAttachments} />
    </>
  );
};

export default ARAttachmentsList;
