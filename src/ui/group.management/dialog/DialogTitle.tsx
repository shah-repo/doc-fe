import { AppBar, Box, IconButton, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import Text from "../../components/Text";
import { Translation } from "../../translations/types";
import styles from "./styles";

interface OwnProps {
  closeDialog: () => void;
  title: Translation;
}

type Props = OwnProps;

export const DialogTitle: React.FunctionComponent<Props> = ({
  closeDialog,
  title,
}) => {
  const classes = styles();
  return (
    <AppBar style={{ position: "relative" }}>
      <Toolbar>
        <IconButton
          className={classes.closeIcon}
          onClick={closeDialog}
          aria-label="Close"
          id="DialogContent-close"
          data-cy="DialogContent-close"
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Box display="block" textAlign="center">
        <Typography variant="h4" className={classes.title}>
          <Text translation={title} />
        </Typography>
      </Box>
    </AppBar>
  );
};

export default DialogTitle;
