import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import AttachmentDeleteAllButton from '../../components/common/attachment.deleteAll/AttachmentDeleteAllButton';
import AttachmentDownloadAllButton from '../../components/common/attachment.downloadAll/AttachmentDownloadAllButton';
import AttachmentField from '../../components/common/attachment.field/container';
import AttachmentIconField from '../../components/common/attachment.icon/container';
import AttachmentSelectItems from '../../components/common/attachment.selectedItems/AttachmentSelectItems';
import Text from '../../components/Text';
import { useAttachments } from '../../hooks/docCustomization/useCustomization';
import Colors from '../../layout/theme/utils/colors';

interface Props {
  isDisabled: boolean
  isNewVersion: boolean
  isAttachmentEmpty: boolean
  labeld?: string
  docRevId: string
  containsRedline: boolean
  docRevStatus: DocumentRevisionStatus
  documentRevision: DocumentRevision
  documentTypeId: string
}

const classes = {
  attachmentHeaderConatainer: {
    display: 'flex',
  },
  attachmentHeadText: {
    flex: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: '12px',
    fontWeight: 600,
    color: Colors.almost_black,
  },
};

const Attachments: React.FunctionComponent<Props> = ({
  isDisabled = false,
  isNewVersion,
  isAttachmentEmpty,
  docRevId,
  containsRedline,
  docRevStatus,
  documentRevision,
  documentTypeId,
  labeld,
}) => {
  const { isVisible, label } = useAttachments(documentTypeId);
  const [selectedAttachments, setSelectedAttachments] = React.useState<{[id: string]: boolean | number[]}>({});

  if (!isVisible) {
    return null;
  }

  const onClearSelection = () => {
    setSelectedAttachments({});
  };

  const onSelectedAttachmentsChange = (selected: {[id: string]: boolean | number[]}) => {
    setSelectedAttachments((prevVal) => ({ ...prevVal, ...selected }));
  };

  return (
    <Box>
      <Box style = {classes.attachmentHeaderConatainer} id="attachmentHeader">
        <Typography variant="h6" style = {classes.attachmentHeadText}>
          <Text message={labeld || label} />
        </Typography>
        <Box display="flex" alignItems="center">
        <AttachmentSelectItems {...{ onClearSelection, selectedAttachments }} />
        <AttachmentDeleteAllButton isAttachmentEmpty = {isAttachmentEmpty}
          docRevId = {docRevId}
          containsRedline={containsRedline}
          docRevStatus = {docRevStatus} />
        <AttachmentDownloadAllButton
          isAttachmentEmpty = {isAttachmentEmpty}
          docRevId = {docRevId}
          containsRedline={containsRedline}
          docRevStatus = {docRevStatus} />
        </Box>
      </Box>
      <AttachmentField name="attachments" component="field" disabled={isDisabled} />
      <AttachmentIconField name="attachments" {...{ isNewVersion, documentRevision, onSelectedAttachmentsChange, selectedAttachments }} />
    </Box>
  );
};

export default React.memo(Attachments);
