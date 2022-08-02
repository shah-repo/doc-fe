import { createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Link, ListItemIcon, ListItemText, makeStyles, Menu, MenuItem, Theme, Typography } from "@material-ui/core";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import CloseIcon from "@material-ui/icons/Close";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import React from "react";
import Text from "../../../../ui/components/Text";
import useDialog from "../../../../ui/hooks/useDialog";
import helpContent from "./content/en.json";
import HelpCenterContact from "./HelpCenterContact";
import HelpCenterList from "./HelpCenterList";
import HelpCenterPopular from "./HelpCenterPopular";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogRoot: {
      pointerEvents: "none",
    },
    dialogContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-start",
    },
    dialogPaper: {
      pointerEvents: "auto",
    },
    // TODO Move to overrides
    titleRoot: {
      display: "flex",
      justifyContent: "space-between",
      padding: theme.spacing(2),
    },
    actionsRoot: {
      padding: theme.spacing(2),
    },
  })
);

const HelpCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dialog = useDialog();
  const classes = useStyles();

  const openContent = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeContent = () => {
    setAnchorEl(null);
  };

  const HelpCenterIcon: React.FC = () => (
    <IconButton color="inherit" size="small" onClick={openContent}>
      <HelpOutlineIcon />
    </IconButton>
  );

  const HelpCenterNavigation: React.FC = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeContent}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <MenuItem onClick={dialog.open}>
        <ListItemIcon><HelpOutlineIcon fontSize="small" /></ListItemIcon>
        <ListItemText><Text translation="help.guides" /></ListItemText>
      </MenuItem>
      <MenuItem>
        <Link href="//help.dev.enlil.io/release_notes.html" target="_blank" rel="noopener noreferrer">
          <ListItemIcon><AssignmentTurnedInIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Text translation="help.release.notes" /></ListItemText>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="//help.dev.enlil.io/faqs.html" target="_blank" rel="noopener noreferrer">
          <ListItemIcon><AssignmentTurnedInIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Text translation="help.faqs" /></ListItemText>
        </Link>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Link href="//enlil.happyfox.com/new/" target="_blank" rel="noopener noreferrer">
          <ListItemIcon><LiveHelpIcon fontSize="small" /></ListItemIcon>
          <ListItemText><Text translation="help.contact" /></ListItemText>
        </Link>
      </MenuItem>
    </Menu>
  );

  // TODO Create generic system-wide dialog component
  const HelpCenterContent: React.FC = () => (
    <Dialog
      hideBackdrop
      disableEnforceFocus
      classes={{
        root: classes.dialogRoot,
        paper: classes.dialogPaper,
        container: classes.dialogContainer,
      }}
      scroll="paper"
      open={dialog.isOpen}
    >
      <DialogTitle disableTypography classes={{
        root: classes.titleRoot,
      }}>
        <Typography variant="h6"><Text translation="help.title" /></Typography>
        <IconButton style={{ padding: 0 }} size="small">
          <CloseIcon onClick={dialog.close} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <HelpCenterList content={helpContent.PO} />
        <HelpCenterPopular />
      </DialogContent>
      <DialogActions classes={{ root: classes.actionsRoot }}>
        <HelpCenterContact />
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <HelpCenterIcon />
      <HelpCenterNavigation />
      <HelpCenterContent />
    </>
  );
};

export default HelpCenter;
