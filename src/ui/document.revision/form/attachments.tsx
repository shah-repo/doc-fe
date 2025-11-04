import { Box, Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { GroupTag } from '../../../state/ducks/auth/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import AttachmentField from '../../components/common/attachment.field/container';
import AttachmentIconField from '../../components/common/attachment.icon/container';
import AttachmentSelectItems from '../../components/common/attachment.selectedItems/AttachmentSelectItems';
import AttachmentDeleteAllButton from '../../components/common/attachment.table/components/AttachmentDeleteAllButton';
import AttachmentDownloadAllButton from '../../components/common/attachment.table/components/AttachmentDownloadAllButton';
import Text from '../../components/Text';
import { checkIsDocumentPO } from '../../documentRevision/helpers/checkDocumentGroup';
import { isDocumentRevisionHasOutput } from '../../documentRevision/helpers/documentRevisionStatus';
import { useAttachments } from '../../hooks/docCustomization/useCustomization';
import useGetHasTag from '../../hooks/useGetHasTag';
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

  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);
  const hasOutput = isDocumentRevisionHasOutput(documentRevision);
  const isPO = checkIsDocumentPO(groupOptions);
  const isPOEditState = isUserAdminEnforce && isPO && hasOutput && isNewVersion;

  const canEdit = !isDisabled && (!isNewVersion || isPOEditState);

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
