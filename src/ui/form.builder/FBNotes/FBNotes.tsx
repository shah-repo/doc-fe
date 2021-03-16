import { Box, IconButton } from "@material-ui/core";
import CommentIcon from "@material-ui/icons/Comment";
import React from "react";
import { FBDialog, FBNotesProps, FBProvider } from "..";
import { withFBNotes } from "./FBNotes.wrap";

const FBNotes: React.FunctionComponent<FBNotesProps> = ({
  onClick,
  dialogState,
}) => (
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
      >
        <CommentIcon />
      </IconButton>
    </Box>
  </FBProvider>
);

export default withFBNotes(FBNotes);
