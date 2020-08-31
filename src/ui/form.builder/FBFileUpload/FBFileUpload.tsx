import { Box } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { FBFileField, FBFileUploadProps, FBInput, FBProvider } from "..";
import { withFBFileUpload } from "./FBFileUpload.wrap";

const FBFileUpload: React.FunctionComponent<FBFileUploadProps> = ({
  disabled,
  name,
  fileUploadState,
  filePresenters,
  readonly = false,
  ...props
}) => (
  <FBInput {...props} {...{ name }} type="fileupload">
    <FBProvider {...{ fileUploadState }}>
      {!readonly && (
        <FBFileField key={`fb-attachment-field-${name}`} {...{ name, disabled }} />
      )}
      {!isEmpty(filePresenters) && (
        <Box mt={2} display="flex" flexDirection="row" flexWrap="wrap">
          {filePresenters}
        </Box>
      )}
    </FBProvider>
  </FBInput>
);

export default withFBFileUpload(FBFileUpload);
