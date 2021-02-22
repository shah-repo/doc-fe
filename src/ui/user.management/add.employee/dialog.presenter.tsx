import { AppBar, Dialog, Toolbar, Typography } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../components/Text";
import styles from "./styles";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
}

const AddEmployeeDialogPresenter: React.FunctionComponent<Props> = ({
  isOpen,
  closeDialog,
  children,
}) => {
  const classes = styles();

  return (
    <Dialog fullScreen={true} open={isOpen}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="default"
            onClick={closeDialog}
            aria-label="Close"
            id="AddEmployeeDialogPresenter-closeDialog"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.dialogTitle}>
            <Text message="user.management.add.employee" />
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialogPresenter;
