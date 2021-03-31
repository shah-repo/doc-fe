import { Box, CircularProgress, Link } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import React from "react";
import { FBFileFieldProps } from "..";
import { withFBAttachmentField } from "./FBFileField.wrap";

const FBFileFieldIcon: React.FunctionComponent<FBFileFieldProps> = ({
  name,
  multiple = true,
  loading = false,
  onChange,
  disabled,
}) =>  (
  <>
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
        </Box>
      </Link>
    </label>
  </>
);

export default withFBAttachmentField(FBFileFieldIcon);
