import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Popover, Typography } from '@material-ui/core';
import Markdown from 'markdown-to-jsx';
import React, { useCallback, useState } from 'react';
import { translate } from '../../../common/intl';
import AnnouncementDetailsDialog from './AnnouncementDetails.dialog';
import { ANNOUNCEMENT_TYPE_ENUM, IAnnouncement } from './interface';
import useStyles from './styles';

interface AnnouncementIndicatorProps {
  announcement: IAnnouncement
}

const AnnouncementIndicator: React.FC<AnnouncementIndicatorProps> = ({ announcement }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handlePopoverOpen = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true);
    handlePopoverClose();
  }, [handlePopoverClose]);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <>
      <Box>
        <FontAwesomeIcon icon={solid('bullhorn')} onMouseEnter={handlePopoverOpen} data-cy="announcement-icon" />
        <Popover
          id={isPopoverOpen ? 'announcement-popover' : undefined}
          open={isPopoverOpen}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          classes={{ paper: classes.announcementPopoverPaper }}
        >
          <Box className={classes.textContainer}>
            <Typography variant="body2" data-cy="announcement-details">
              <Markdown>{announcement.text}</Markdown>
            </Typography>
            <Box className={classes.button}>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleDialogOpen}
                fullWidth
                data-cy="announcement-button"
              >
                {translate('supplier.announcement.view.details')}
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>

      {isDialogOpen && announcement.type === ANNOUNCEMENT_TYPE_ENUM.FORM_UPGRADE && (
        <AnnouncementDetailsDialog
          isOpen={isDialogOpen}
          handleClose={handleDialogClose}
          announcement={announcement}
        />
      )}
    </>
  );
};

export default AnnouncementIndicator;
