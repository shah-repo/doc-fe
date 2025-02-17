import { Box, Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import AttachmentField from '../../components/common/attachment.icon/container';
import AttachmentSelectItems from '../../components/common/attachment.selectedItems/AttachmentSelectItems';
import AttachmentDownloadAllButton from '../../components/common/attachment.table/components/AttachmentDownloadAllButton';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';

export interface Props {
  isAttachmentEmpty: boolean
  docRevId?: string
  containsRedline?: boolean
  label?: string
  docRevStatus: DocumentRevisionStatus
  documentRevision?: DocumentRevision
}

export const Attachment: React.FunctionComponent<Props> = ({ isAttachmentEmpty, docRevId, containsRedline, docRevStatus, label, documentRevision }) => {
  const [selectedAttachments, setSelectedAttachments] = React.useState<{[id: string]: boolean | number[]}>({});
  const [isHeaderChecked, setIsHeaderChecked] = React.useState(false);

  const onHeaderCheck = (value: boolean) => {
    setIsHeaderChecked(value);
  };

  const onSelectedAttachmentsChange = (selected: {[id: string]: boolean | number[]}) => {
    if (isEmpty(selected)) {
      return setSelectedAttachments({});
    }
    setSelectedAttachments((prevVal) => ({ ...prevVal, ...selected }));
  };

  const onClearSelection = () => {
    setSelectedAttachments({});
  };

  const classes = {
    buttonsContainer: {
      display: 'flex',
    },
    buttonLeft: {
      flex: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      fontWeight: 600,
      fontSize: 12,
      color: Colors.almost_black,
    },

    buttonRight: {
      display: isAttachmentEmpty ? 'none' : 'flex',
      justifyContent: 'flex-end',
      paddingRight: '25px',
      cursor: 'pointer',
    },
    icon: {
      verticalAlign: 'middle',
    },
  };

  const emptyAttachmentsRenderer = isAttachmentEmpty && (
    <Typography variant="h5" style={{ marginTop: '10px', fontSize: '14px', marginBottom: '30px' }}>
      <Text message="common.no.attachments" />
    </Typography>
  );

  return (
    <Box pl={0} width="100%">
      <Box display="flex">
        <Typography variant="h6" style = {classes.buttonLeft}>
          <Text message={label ?? 'common.attachments' } />
        </Typography>
        <AttachmentSelectItems {...{ onClearSelection, selectedAttachments }} />
        <AttachmentDownloadAllButton
          {...{ selectedAttachments, documentRevision, isAttachmentEmpty, docRevStatus }}
          docRevId={docRevId ?? ''}
          containsRedline={containsRedline ?? false}
        />
      </Box>
      <AttachmentField
        name="attachments"
        disabled
        {...{ docRevId, selectedAttachments, onSelectedAttachmentsChange, isHeaderChecked, onHeaderCheck }}
      />
      {emptyAttachmentsRenderer}
    </Box>
  );
};

export default Attachment;
