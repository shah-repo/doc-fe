import { Box, Popover, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import { IndicatorTypeEnum } from './interface';
import useStyles from './styles';

interface InfoIndicatorProps {
  type: IndicatorTypeEnum
  text: string
}

const InfoIndicator: React.FC<InfoIndicatorProps> = ({ type, text }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isInfo = type === IndicatorTypeEnum.INFO;
  const IconComponent = isInfo ? InfoIcon : WarningIcon;
  const textClass = isInfo ? classes.infoIndicatorPopoverText : classes.infoIndicatorWarningText;

  return (
    <Box display="inline">
      <IconComponent
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={!isInfo ? classes.infoIndicatorWarningIcon : undefined}
      />
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
          <Typography
            component="span"
            className={textClass}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default InfoIndicator;
