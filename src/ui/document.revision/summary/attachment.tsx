import { Box, Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import AttachmentDownloadAllButton from '../../components/common/attachment.downloadAll/AttachmentDownloadAllButton';
import AttachmentField from '../../components/common/attachment.icon/container';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';

export interface Props {
  isAttachmentEmpty: boolean
  docRevId?: string
  containsRedline?: boolean
  label?: string
  docRevStatus: DocumentRevisionStatus
}

export const Attachment: React.FunctionComponent<Props> = ({ isAttachmentEmpty, docRevId, containsRedline, docRevStatus, label }) => {
  const [selectedAttachments, setSelectedAttachments] = React.useState<{[id: string]: boolean | number[]}>({});

  const onSelectedAttachmentsChange = (selected: {[id: string]: boolean | number[]}) => {
    if(isEmpty(selected)) {
      return setSelectedAttachments({});
    }
    setSelectedAttachments((prevVal) => ({ ...prevVal, ...selected }));
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
          <Text message={label || 'common.attachments' } />
        </Typography>
        <AttachmentDownloadAllButton
          isAttachmentEmpty = {isAttachmentEmpty}
          docRevId = {docRevId ?? ''}
          containsRedline = {containsRedline ?? false}
          docRevStatus = {docRevStatus} />
      </Box>
      <AttachmentField name="attachments" disabled={true} docRevId={docRevId} {...{ selectedAttachments, onSelectedAttachmentsChange }} />
      {emptyAttachmentsRenderer}
    </Box>
  );
};

export default Attachment;
