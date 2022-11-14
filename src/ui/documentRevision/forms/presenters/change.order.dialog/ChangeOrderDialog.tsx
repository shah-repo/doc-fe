import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../../../components/Text";
// import { ReactComponent as NewTabIcon } from "../../../assets/images/new_tab.svg";
import useStyles from "./ChangeOrderDialog.styles";

import { ReactComponent as NewTabIcon } from "../../../../../assets/images/new_tab.svg";

interface Props {
  opened: boolean;
  handleCloseDialog: () => void;
  handleOpenNewTab: () => void;
}

const ChangeOrderDialog: React.FC<Props> = ({ opened, handleCloseDialog, handleOpenNewTab, children }) =>
{ const classes = useStyles();

  return (
    <Dialog
      hideBackdrop
      disableEnforceFocus
      classes={{
        root: classes.root,
        paper: classes.paper,
        // container: classes.container,
      }}
      scroll="paper"
      open={opened}
      style={{ maxWidth: "none" }}
      maxWidth={false}
    >
      <DialogTitle style={{ display: "flex" }} disableTypography>
        <Typography className={classes.heading}>
          <Text translation="changeorder.dialog.title" />
        </Typography>
        <IconButton
          className={classes.close}
          size="small"
          onClick={handleOpenNewTab}
          // style={{ backgroundColor: "red" }}
        >
          <NewTabIcon />
        </IconButton>
        <IconButton
          className={classes.close}
          size="small"
          onClick={handleCloseDialog}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  ); }
;

export default ChangeOrderDialog;
