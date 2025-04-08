import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import { getHasPermission, hasActivePremiumFeatureSubscription } from '../../../../common/utils/selectors';
import { Permission } from '../../../../state/ducks/auth/types';
import { PremiumFeature } from '../../../../state/ducks/company/types';
import { AiWidgetContext } from '../../../app/AiWidget';
import Text from '../../Text';
import { useStyles } from './styles';

interface Props {
  selectedAttachments: {[id: string]: boolean | number[]}
  onClearSelection: () => void
}

const AttachmentSelectItems: React.FunctionComponent<Props> = ({
  selectedAttachments,
  onClearSelection,
}) => {
  const classes = useStyles();
  const aiWidgetContext = useContext(AiWidgetContext);
  const selectedAttachmentsCount = Object.values(selectedAttachments).filter(value => value === true).length;
  const hasActiveAiFeature = useSelector(hasActivePremiumFeatureSubscription(PremiumFeature.AI));
  const hasAiPermission = useSelector(getHasPermission(Permission.PREMIUM_AI));
  const isWidgetActive = hasActiveAiFeature && hasAiPermission;

  if (selectedAttachmentsCount === 0) {
    return null;
  }

  const selectedIds = Object.entries(selectedAttachments)
    .filter(([id, selected]) => selected)
    .map(([id]) => id);

  const handleSummarizeAi = () => {
    aiWidgetContext?.summarizeAttachments(selectedIds);
  };

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
      {isWidgetActive && (
      <Tooltip title={translate('common.summarize.with.ai')}>
        <IconButton onClick={handleSummarizeAi} className={classes.aiButton}>
          <FontAwesomeIcon icon={regular('stars')} className={classes.aiIcon} />
        </IconButton>
      </Tooltip>
      )}
    </Box>
  );
};

export default AttachmentSelectItems;
