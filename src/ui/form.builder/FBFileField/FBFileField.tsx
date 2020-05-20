import { Box, CircularProgress, Link } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import React from "react";
import { FBFileFieldProps } from ".";
import Text from "../../components/Text";
import { withFBAttachmentField } from "./FBFileField.wrap";

const FBFileField: React.FunctionComponent<FBFileFieldProps> = ({
  name,
  multiple = true,
  loading = false,
  onChange,
  disabled,
}) =>  (
  <Box bgcolor="rgba(0, 0, 0, 0.09)" py={2}>
    <input
      accept="*"
      type="file"
      id={`fb-attachment-field-${name}`}
      style={{ display: "none" }}
      {...{ onChange, multiple, disabled }}
    />
    <label htmlFor={`fb-attachment-field-${name}`}>
      <Link component="span" variant="button">
        <Box pl={1} display="flex" flexDirection="row">
          {loading && <Box mt={0.3} mr={1}><CircularProgress size={18}/></Box>}
          {!loading && <AttachFile width={20} height={20} />}
          <Box mt={0.2}><Text message="common.upload.files" /></Box>
        </Box>
      </Link>
    </label>
  </Box>
);

export default withFBAttachmentField(FBFileField);
