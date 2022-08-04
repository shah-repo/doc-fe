import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../../../../../ui/components/Text";
import HelpCenterContact from "../HelpCenterContact/HelpCenterContact";
import HelpCenterList from "../HelpCenterList/HelpCenterList";
import HelpCenterPopular from "../HelpCenterPopular/HelpCenterPopular";
import useStyles from "./HelpCenterContent.styles";

interface Props {
  content: any;
  isOpen: boolean;
  handleCloseDialog: () => void;
}

const HelpCenterContent: React.FC<Props> = ({ content, isOpen, handleCloseDialog }) => {
  const classes = useStyles();

  // TODO Create generic system-wide dialog component
  return (
    <Dialog
      hideBackdrop
      disableEnforceFocus
      classes={{
        root: classes.dialogRoot,
        paper: classes.dialogPaper,
        container: classes.dialogContainer,
      }}
      scroll="paper"
      open={isOpen}
    >
      <DialogTitle disableTypography classes={{
        root: classes.titleRoot,
      }}>
        <Typography variant="h6"><Text translation="help.title" /></Typography>
        <IconButton style={{ padding: 0 }} size="small" onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent classes={{
        root: classes.contentRoot,
      }} dividers>
        <HelpCenterList content={content} />
        <HelpCenterPopular />
      </DialogContent>
      <DialogActions classes={{ root: classes.actionsRoot }}>
        <HelpCenterContact />
      </DialogActions>
    </Dialog>
  );
};

export default HelpCenterContent;
