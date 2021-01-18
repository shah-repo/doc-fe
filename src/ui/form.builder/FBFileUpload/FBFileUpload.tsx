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
  viewMode,
  ...props
}) =>  (
  <FBInput {...props} {...{ name }} type="fileupload" gutter={!viewMode}>
    <FBProvider {...{ fileUploadState }}>
      {!readonly && !viewMode && (
        <FBFileField key={`fb-attachment-field-${name}`} {...{ name, disabled }} />
      )}
      {!isEmpty(filePresenters) && (
        <Box mt={viewMode ? 0 : 2} display="flex" flexDirection="row" flexWrap="wrap">
          {filePresenters}
        </Box>
      )}
    </FBProvider>
  </FBInput>
);

export default withFBFileUpload(FBFileUpload);
