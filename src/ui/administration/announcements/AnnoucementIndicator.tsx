import { Box, Button, makeStyles, Popover, Typography } from '@material-ui/core';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Markdown from 'markdown-to-jsx';
import React, { useState } from 'react';
import Colors from '../../layout/theme/utils/colors';
import AnnouncementDetailsDialog from './AnnouncementDetails.dialog';
import { ANNOUNCEMENT_TYPE_ENUM, IAnnouncement } from './interface';

const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    padding: theme.spacing(1),
    maxWidth: '400px',
    backgroundColor: Colors.medium_gray,
  },
}));

const AnnouncementIndicator: React.FC<{
  announcement: IAnnouncement
}> = ({ announcement }) => {
  const classes = useStyles();

  // Popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleAnnouncementPopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnnouncementPopoverClose = () => {
    setAnchorEl(null);
  };

  // Announcement Details Dialog
  const [isAnnouncementDetailsDialogVisible, setIsAnnouncementDetailsDialogVisible] = useState<boolean>(false);
  const showAnnouncementDetails = () => {
    setIsAnnouncementDetailsDialogVisible(true);
    handleAnnouncementPopoverClose();
  };

  const handleAnnouncementDetailsDialogClose = () => {
    setIsAnnouncementDetailsDialogVisible(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'announcement-text-popover' : undefined;

  function proceedToDetails () {
    showAnnouncementDetails();
  }

  return (
    <>
      <Box>
        <AnnouncementIcon aria-describedby={id}
          onMouseEnter={handleAnnouncementPopoverOpen}
        // onMouseLeave={handleAnnouncementPopoverClose}
        />
        <Popover
          classes={{
            paper: classes.popoverPaper,
          }}
          id = {id}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          onClose={handleAnnouncementPopoverClose}
        // disableRestoreFocus
        >
          <Typography
            variant="body2"
            style={{ marginTop: '4px', marginBottom: '4px' }}
          >
            <Markdown>{announcement.text}</Markdown>
          </Typography>
          <Button color="secondary" variant="outlined" onClick={proceedToDetails} fullWidth> View Details </Button>
        </Popover>
      </Box>
      {isAnnouncementDetailsDialogVisible && announcement.type === ANNOUNCEMENT_TYPE_ENUM.FORM_UPGRADE && (
        <AnnouncementDetailsDialog
          isOpen={isAnnouncementDetailsDialogVisible}
          handleClose={handleAnnouncementDetailsDialogClose}
          announcement={announcement}
        />
      )}
    </>
  );
};

export default AnnouncementIndicator;
