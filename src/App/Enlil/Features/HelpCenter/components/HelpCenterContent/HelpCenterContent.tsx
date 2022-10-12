import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as CloseIcon } from "../../../../../../assets/images/cross.svg";
import Text from "../../../../../../ui/components/Text";
import HelpCenterContact from "../HelpCenterContact/HelpCenterContact";
import HelpCenterList from "../HelpCenterList/HelpCenterList";
import HelpCenterPopular from "../HelpCenterPopular/HelpCenterPopular";
import useStyles from "./HelpCenterContent.styles";

interface Props {
  content: any;
  opened: boolean;
  handleCloseDialog: () => void;
}

const HelpCenterContent: React.FC<Props> = ({ content, opened, handleCloseDialog }) => {
  const classes = useStyles();

  return (
    <Dialog
      hideBackdrop
      disableEnforceFocus
      classes={{
        root: classes.root,
        paper: classes.paper,
        container: classes.container,
      }}
      scroll="paper"
      open={opened}
    >
      <DialogTitle>
        <Typography variant="h6">
          <Text translation="help.title" />
        </Typography>
        <IconButton
          className={classes.close}
          size="small"
          onClick={handleCloseDialog}
          data-cy="help-center.content-closer"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content} dividers data-cy="help-center.content">
        <HelpCenterList content={content} />
        <HelpCenterPopular />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <HelpCenterContact />
      </DialogActions>
    </Dialog>
  );
};

export default HelpCenterContent;
