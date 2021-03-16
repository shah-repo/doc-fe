import { Box, IconButton } from "@material-ui/core";
import React from "react";
import { FBDialog, FBProvider } from "..";
import { ReactComponent as NoteIcon } from "../../../assets/images/note.svg";
import styles from "./FBNotes.styles";
import { FBNotesProps } from "./FBNotes.types";
import { withFBNotes } from "./FBNotes.wrap";

const FBNotes: React.FunctionComponent<FBNotesProps> = ({
  onClick,
  dialogState,
}) => {
  const classes = styles();
  return (
    <FBProvider {...{ dialogState }}>
      <Box
        flex={1}
        display="flex"
        justifyContent="flex-end"
      >
        <FBDialog />
        <IconButton
          id="fb-notes"
          aria-label="fb-notes"
          onClick={onClick}
          className={classes.iconButton}
        >
          <NoteIcon />
        </IconButton>
      </Box>
    </FBProvider>
  );
};

export default withFBNotes(FBNotes);
