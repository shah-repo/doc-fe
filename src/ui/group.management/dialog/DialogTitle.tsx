import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import styles from "./styles";

interface OwnProps {
  closeDialog: () => void;
  title: any;
}

type Props = OwnProps;

export const DialogTitle: React.FunctionComponent<Props> = ({
  closeDialog,
  title,
}) => {
  const classes = styles();
  return (
    <AppBar>
      <Toolbar>
        <IconButton
          className={classes.closeIcon}
          onClick={closeDialog}
          aria-label="Close"
          id="DialogContent-close"
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Box display="block" textAlign="center">
        <Typography variant="h4" className={classes.title}>
          {title}
        </Typography>
      </Box>
    </AppBar>
  );
};

export default DialogTitle;
