import { Box, Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import AttachmentField from '../../components/common/attachment.field/container';
import AttachmentIconField from '../../components/common/attachment.icon/container';
import AttachmentSelectItems from '../../components/common/attachment.selectedItems/AttachmentSelectItems';
import AttachmentDeleteAllButton from '../../components/common/attachment.table/components/AttachmentDeleteAllButton';
import AttachmentDownloadAllButton from '../../components/common/attachment.table/components/AttachmentDownloadAllButton';
import Text from '../../components/Text';
import { useAttachments } from '../../hooks/docCustomization/useCustomization';
import { useStyles } from './styles';

interface Props {
  isDisabled: boolean
  isNewVersion: boolean
  labeld?: string
  docRevId: string
  containsRedline: boolean
  docRevStatus: DocumentRevisionStatus
  documentRevision: DocumentRevision
  documentTypeId: string
}

const Attachments: React.FunctionComponent<Props> = ({
  isDisabled = false,
  isNewVersion,
  docRevId,
  containsRedline,
  docRevStatus,
  documentRevision,
  documentTypeId,
  labeld,
}) => {
  const classes = useStyles();
  const { isVisible, label } = useAttachments(documentTypeId);
  const [selectedAttachments, setSelectedAttachments] = React.useState<{[id: string]: boolean | number[]}>({});
  const [isHeaderChecked, setIsHeaderChecked] = React.useState(false);

  const canEdit = !isDisabled && !isNewVersion;

  if (!isVisible) {
    return null;
  }

  const onClearSelection = () => {
    setSelectedAttachments({});
  };

  const onHeaderCheck = (value: boolean) => {
    setIsHeaderChecked(value);
  };

  const onSelectedAttachmentsChange = (selected: {[id: string]: boolean | number[]}) => {
    if (isEmpty(selected)) {
      return setSelectedAttachments({});
    }
    setSelectedAttachments((prevVal) => ({ ...prevVal, ...selected }));
  };

  return (
    <Box>
      <Box className = {classes.attachmentHeaderContainer} id="attachmentHeader">
        <Typography variant="h6" className = {classes.attachmentHeadText}>
          <Text message={labeld || label} />
        </Typography>
        <Box display="flex" alignItems="center">
          <AttachmentSelectItems {...{ onClearSelection, selectedAttachments }} />
          {canEdit && <AttachmentDeleteAllButton {...{ docRevId, containsRedline, docRevStatus, selectedAttachments, documentRevision, onSelectedAttachmentsChange, onHeaderCheck }} />}
          <AttachmentDownloadAllButton {...{ docRevId, containsRedline, docRevStatus, selectedAttachments, documentRevision }} />
        </Box>
      </Box>
      <AttachmentField name="attachments" component="field" disabled={!canEdit} />
      <AttachmentIconField name="attachments" {...{ isNewVersion, documentRevision, onSelectedAttachmentsChange, selectedAttachments, onHeaderCheck, isHeaderChecked }} />
    </Box>
  );
};

export default React.memo(Attachments);
