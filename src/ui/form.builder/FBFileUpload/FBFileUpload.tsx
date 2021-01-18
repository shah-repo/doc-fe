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
        <FBFilesPresenter
          boxProps={{ mt: 2 }}
          {...{ files }}
        />
      )}
    </FBProvider>
  </FBInput>
);

export default withFBFileUpload(FBFileUpload);
