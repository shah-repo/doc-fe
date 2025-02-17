import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import Text from '../../Text';
import styles from './styles';

interface Props {
  selectedAttachments: {[id: string]: boolean | number[]}
  onClearSelection: () => void
}

const AttachmentSelectItems: React.FunctionComponent<Props> = ({
  selectedAttachments,
  onClearSelection,
}) => {
  const classes = styles();
  const selectedAttachmentsCount = Object.values(selectedAttachments).filter(value => value === true).length;

  if (selectedAttachmentsCount === 0) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <IconButton onClick={onClearSelection} className={classes.clearSelectionButton}>
        <FontAwesomeIcon icon={solid('x')} className={classes.clearSelectionIcon} />
      </IconButton>
      <span>
        <span className={classes.attachmentCount}>{selectedAttachmentsCount}</span>
        &nbsp;
        <Text message={translate('attachment.header.selected')} />
      </span>
      <hr className={classes.hr} />
      <Tooltip title={translate('common.summarize.with.ai')}>
        <IconButton className={classes.aiButton}>
          <FontAwesomeIcon icon={regular('stars')} className={classes.aiIcon} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default AttachmentSelectItems;
