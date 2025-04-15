import { Box, Button, Popover, Typography } from '@material-ui/core';
import AnnouncementIcon from '@material-ui/icons/Announcement';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handlePopoverOpen = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
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
  const popoverId = isPopoverOpen ? 'announcement-popover' : undefined;

  return (
    <>
      <Box>
        <AnnouncementIcon
          aria-describedby={popoverId}
          onMouseEnter={handlePopoverOpen}
          data-cy="announcement-icon"
        />
        <Popover
          id={popoverId}
          open={isPopoverOpen}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          classes={{ paper: classes.announcementPopoverPaper }}
        >
          <Typography variant="body2" className={classes.popoverText} data-cy="announcement-details">
            <Markdown>{announcement.text}</Markdown>
          </Typography>
          <Button
            color="secondary"
            variant="outlined"
            onClick={handleDialogOpen}
            fullWidth
            data-cy="announcement-button"
          >
            {translate('supplier.announcement.view.details')}
          </Button>
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
