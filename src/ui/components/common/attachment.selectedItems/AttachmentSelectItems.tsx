import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, createStyles, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import Colors from '../../../layout/theme/utils/colors';
import Text from '../../Text';

interface Props {
  selectedAttachments: {[id: string]: boolean | number[]}
  onClearSelection: () => void
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    clearSelectionButton: {
      paddingTop: 0,
      paddingBottom: 0,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    clearSelectionIcon: {
      height: 12,
      width: 12,
    },
    aiButton: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      padding: theme.spacing(0.6),
      background: 'linear-gradient(226.32deg, #01A6C7 17.49%, #4C69FF 44.44%, #011FBB 93.06%)',
    },
    aiIcon: {
      color: Colors.white,
      height: 12,
      width: 12,
    },
    hr: {
      margin: '0px 8px',
      height: 18,
    },
    attachmentCount: {
      color: Colors.navy,
      fontWeight: 700,
      marginRight: theme.spacing(0.4),
    },
  }));

const AttachmentSelectItems: React.FunctionComponent<Props> = ({
  selectedAttachments,
  onClearSelection,
}) => {
  const classes = styles();
  const selectedAttachmentsCount = Object.values(selectedAttachments).filter(value => value === true).length;

  if(selectedAttachmentsCount === 0) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={onClearSelection} className={classes.clearSelectionButton}>
        <FontAwesomeIcon icon={solid('x')} className={classes.clearSelectionIcon} />
      </IconButton>
      <span className={classes.attachmentCount}>{selectedAttachmentsCount}</span>
      <Text message={translate('attachment.header.selected')} />
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
