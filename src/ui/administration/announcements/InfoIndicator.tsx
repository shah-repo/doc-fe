import { Box, Popover, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import { IndicatorTypeEnum } from './interface';
import useStyles from './styles';

const InfoIndicator: React.FC<{type: IndicatorTypeEnum, text: string}> = ({ type, text }) => {
  const classes = useStyles();

  // Popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box>
        {type === IndicatorTypeEnum.INFO
          && <InfoIcon
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        }
        {type === IndicatorTypeEnum.WARNING
          && <WarningIcon className={classes.infoIndicatorWarningIcon}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        }
        <Popover
          style={{ pointerEvents: 'none' }}
          classes={{
            paper: classes.infoIndicatorPopoverPaper,
          }}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography className={type === IndicatorTypeEnum.INFO ? classes.infoIndicatorPopoverText : classes.infoIndicatorWarningText}
            component="span"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </Popover>
      </Box>

    </>
  );
};

export default InfoIndicator;
