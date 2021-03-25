import { Badge, Box, IconButton, withStyles } from "@material-ui/core";
import React from "react";
import { FBDialog, FBNotesProps, FBProvider } from "..";
import { ReactComponent as NoteIcon } from "../../../assets/images/note.svg";
import styles from "./FBNotes.styles";
import { withFBNotes } from "./FBNotes.wrap";

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -1,
    border: `2px solid ${theme.palette.background.paper}`,
    color: theme.palette.common.white,
    padding: "0 4px",
    backgroundColor: theme.palette.error.main,
  },
}))(Badge);

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
          <StyledBadge
            badgeContent={notesNumber}
          >
            <NoteIcon />
          </StyledBadge>
        </IconButton>
      </Box>
    </FBProvider>
  );
};

export default withFBNotes(FBNotes);
