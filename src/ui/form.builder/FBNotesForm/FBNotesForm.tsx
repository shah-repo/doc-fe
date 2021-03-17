import { Box, IconButton, Typography } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { isEmpty } from "lodash";
import moment from "moment";
import React from "react";
import { FBFilesPresenter, FBFileUpload, FBForm, FBMapWrapper } from "..";
import Text from "../../components/Text";
import FBInputBaseField from "../FBInputBaseField/FBInputBaseField";
import styles from "./FBNotesForm.styles";
import { FBNoteItem, FBNotesFormProps } from "./FBNotesForm.types";
import { withFBNotesForm } from "./FBNotesForm.wrap";

const FBNotesForm: React.FunctionComponent<FBNotesFormProps> = ({
  handleNote,
  formState,
  files,
  notesFormState,
  notes,
  ...props
}) => {
  const classes = styles();
  return (
    <FBForm {...{ formState, notesFormState }}>
      <FBMapWrapper<FBNoteItem[] | undefined> collection={notes}>
        {(note: FBNoteItem, index) => {
          const logo = !note?.avatar ? "/avatar_placeholder.svg" : note?.avatar;
          const lastNote = index === ((notes?.length as number) - 1);
          return (
            <Box pb={lastNote ? 7 : 3}>
              <Box display="flex" pb={1}>
                <img className={classes.avatar} src={logo}  alt="UserProfile" />
                <Box>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                    <Text message={note?.senderName} />
                  </Typography>
                  <Typography variant="subtitle2">
                    <Text message={moment.utc(note.createdAt).local().startOf("seconds").fromNow()} />
                  </Typography>
                </Box>
              </Box>
              <Box borderBottom={lastNote ? 0 : "1px solid lightgrey"} >
                <Typography variant="subtitle1" style={{ marginBottom: 16, marginLeft: 64 }}>
                  <Text message={note.description} />
                </Typography>
                <Box marginLeft={8}>
                  <FBFilesPresenter files={note.attachments} mode="raw" />
                </Box>
              </Box>
            </Box>
          ); }}
      </FBMapWrapper>
      <Box
        border="1px solid lightgrey"
        height="max-content"
        display="flex"
        flexWrap="wrap"
        borderRadius="4px"
      >
        <FBInputBaseField
          name="noteText"
          placeholder="common.type.here"
          style={{ margin: 8, width: 435 }}
        />
        <Box mt={1.5}>
          <FBFileUpload
            name="noteFile"
            mode="fileUploadIcon"
            gutter={false}
            withState
          />
        </Box>
        <IconButton
          id="send-icon"
          aria-label="send-icon"
          className={classes.iconButton}
          onClick={handleNote}
        >
          <SendIcon />
        </IconButton>
        {!isEmpty(files) &&
        <Box
          width="100%"
          padding={1}
        >
          <FBFilesPresenter {...{ files }} mode="raw" />
        </Box>}
      </Box>
    </FBForm>
  );
};

export default withFBNotesForm(FBNotesForm);
