import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Popover, Typography } from '@material-ui/core';
import React from 'react';
import useHover from '../../hooks/useHover';
import { IndicatorTypeEnum } from './interface';
import useStyles from './styles';

interface InfoIndicatorProps {
  type: IndicatorTypeEnum
  text: string
}

const InfoIndicator: React.FC<InfoIndicatorProps> = ({ type, text }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [iconRef, iconRefHovered] = useHover<HTMLElement>();

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isInfo = type === IndicatorTypeEnum.INFO;

  const icon = isInfo
    ? iconRefHovered ? solid('circle-info') : regular('circle-info')
    : iconRefHovered ? solid('triangle-exclamation') : regular('triangle-exclamation');

  const iconClass = isInfo ? classes.infoIndicatorIcon : classes.infoIndicatorWarningIcon;
  const textClass = isInfo ? classes.infoIndicatorPopoverText : classes.infoIndicatorWarningText;

  return (
    <Box display="inline">
      <span className={classes.infoIcon} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} ref={iconRef}>
        <FontAwesomeIcon icon={icon} className={iconClass} data-cy={`info-indicator-${type.toLowerCase()}`} />
      </span>
      <Popover
        style={{ pointerEvents: 'none' }}
        classes={{ paper: classes.infoIndicatorPopoverPaper }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box p={1}>
          <Typography component="span" className={textClass} dangerouslySetInnerHTML={{ __html: text }} />
        </Box>
      </Popover>
    </Box>
  );
};

export default InfoIndicator;
