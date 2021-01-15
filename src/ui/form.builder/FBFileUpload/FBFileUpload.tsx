import { Box } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { FBFileField, FBFilesPresenter, FBFileUploadProps, FBInput, FBProvider } from "..";
import { withFBFileUpload } from "./FBFileUpload.wrap";

const FBFileUpload: React.FunctionComponent<FBFileUploadProps> = ({
  disabled,
  name,
  fileUploadState,
  readonly = false,
  files,
  ...props
}) =>  (
  <FBInput {...props} {...{ name }} type="fileupload">
    <FBProvider {...{ fileUploadState }}>
      {!readonly && (
        <FBFileField key={`fb-attachment-field-${name}`} {...{ name, disabled }} />
      )}
      {!isEmpty(files) && (
        <Box mt={2} display="flex" flexDirection="row" flexWrap="wrap">
          <FBFilesPresenter
            {...{ files }}
          />
        </Box>
      )}
    </FBProvider>
  </FBInput>
);

export default withFBFileUpload(FBFileUpload);
