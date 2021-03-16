import { Box, IconButton, Typography } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { isEmpty } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { FBFilesPresenter, FBFileUpload, FBForm } from "..";
import { authSelectors } from "../../../state/ducks/auth";
import Text from "../../components/Text";
import FBInputBaseField from "../FBInputBaseField/FBInputBaseField";
import styles from "./FBNotesForm.styles";
import { FBNotesFormProps } from "./FBNotesForm.types";
import { withFBNotesForm } from "./FBNotesForm.wrap";

const FBNotesForm: React.FunctionComponent<FBNotesFormProps> = ({
  handleNote,
  formState,
  files,
  ...props
}) => {
  const classes = styles();
  const avatar = useSelector(authSelectors.currentEmployeeAvatar);
  const logo = !avatar ? "/avatar_placeholder.svg" : avatar;

  return (
    <FBForm {...{ formState }}>
      <Box display="flex" pb={1}>
        <img className={classes.avatar} src={logo}  alt="UserProfile" />
        <Box>
          <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
            <Text message="Sara" />
          </Typography>
          <Typography variant="subtitle2">
            <Text message="30 mins ago" />
          </Typography>
        </Box>
      </Box>
      <Box borderBottom="1px solid lightgrey">
        <Typography variant="subtitle1" style={{ marginLeft: 65, marginBottom: 16 }}>
          <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" />
        </Typography>
      </Box>
      <Box
        border="1px solid lightgrey"
        height="max-content"
        display="flex"
        flexWrap="wrap"
        borderRadius="4px"
      >
        <FBInputBaseField
          name="noteText"
        />
        <Box mt={1.5}>
          <FBFileUpload
            name="noteFile"
            attachmentShortcut
            gutter={false}
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
