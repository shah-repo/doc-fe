import { Box, makeStyles, Popover, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import React from 'react';
import Colors from '../../layout/theme/utils/colors';
import { IndicatorTypeEnum } from './interface';

const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    padding: theme.spacing(1),
    maxWidth: '400px',
    backgroundColor: Colors.platinum_gray,
  },
  warningIcon: {
    color: Colors.error_red,
  },
  popoverText: {
    marginTop: '4px',
    fontSize: 'small',
  },
  warningText: {
    color: Colors.latest_red_varient,
    marginTop: '4px',
    fontSize: 'small',
  },
}));

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
          && <WarningIcon className={classes.warningIcon}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        }
        <Popover
          style={{ pointerEvents: 'none' }}
          classes={{
            paper: classes.popoverPaper,
          }}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography className={type === IndicatorTypeEnum.INFO ? classes.popoverText : classes.warningText}
            component="span"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </Popover>
      </Box>

    </>
  );
};

export default InfoIndicator;
