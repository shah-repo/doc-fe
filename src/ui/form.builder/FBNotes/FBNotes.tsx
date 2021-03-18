import { Box, IconButton } from "@material-ui/core";
import React from "react";
import { FBDialog, FBNotesProps, FBProvider } from "..";
import { ReactComponent as NoteIcon } from "../../../assets/images/note.svg";
import styles from "./FBNotes.styles";
import { withFBNotes } from "./FBNotes.wrap";

const FBNotes: React.FunctionComponent<FBNotesProps> = ({
  onClick,
  dialogState,
  notesNumber,
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
        {notesNumber}
      </Box>
    </FBProvider>
  );
};

export default withFBNotes(FBNotes);
