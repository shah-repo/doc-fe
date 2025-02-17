import { Box, createStyles, makeStyles, Typography } from '@material-ui/core';
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

const styles = makeStyles(() =>
  createStyles({
    attachmentHeaderContainer: {
      display: 'flex',
    },
    attachmentHeadText: {
      flex: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      fontSize: 12,
      fontWeight: 600,
      color: Colors.almost_black,
    },
  }));

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
  const classes = styles();
  const { isVisible, label } = useAttachments(documentTypeId);
  const [selectedAttachments, setSelectedAttachments] = React.useState<{[id: string]: boolean | number[]}>({});
  const [isHeaderChecked, setIsHeaderChecked] = React.useState(false);

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
          <AttachmentDeleteAllButton {...{ docRevId, containsRedline, docRevStatus, selectedAttachments, documentRevision, onSelectedAttachmentsChange, onHeaderCheck }} />
          <AttachmentDownloadAllButton {...{ docRevId, containsRedline, docRevStatus, selectedAttachments, documentRevision }} />
        </Box>
      </Box>
      <AttachmentField name="attachments" component="field" disabled={isDisabled} />
      <AttachmentIconField name="attachments" {...{ isNewVersion, documentRevision, onSelectedAttachmentsChange, selectedAttachments, onHeaderCheck, isHeaderChecked }} />
    </Box>
  );
};

export default React.memo(Attachments);
