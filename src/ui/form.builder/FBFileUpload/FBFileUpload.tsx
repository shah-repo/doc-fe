import { isEmpty } from "lodash";
import React from "react";
import { FBFileField, FBFilesPresenter, FBFileUploadProps, FBInput, FBProvider } from "..";
import FBFileFieldIcon from "../FBFileField/FBFileField.icon";
import { withFBFileUpload } from "./FBFileUpload.wrap";

const FBFileUpload: React.FunctionComponent<FBFileUploadProps> = ({
  disabled,
  name,
  fileUploadState,
  readonly = false,
  files,
  mode = "fileUpload",
  gutter,
  ...props
}) =>  (
  <FBInput {...props} {...{ name, gutter }} type="fileupload">
    <FBProvider {...{ fileUploadState }}>
      {!readonly && mode === "fileUpload" && (
        <FBFileField key={`fb-attachment-field-${name}`} {...{ name, disabled }} />
      )}
      {mode === "fileUploadIcon" && <FBFileFieldIcon key={`fb-attachment-field-${name}`} {...{ name, disabled }} /> }
      {mode === "fileUpload" && !isEmpty(files) && (
        <FBFilesPresenter
          boxProps={{ mt: 2 }}
          {...{ files, disabled }}
        />
      )}
    </FBProvider>
  </FBInput>
);

export default withFBFileUpload(FBFileUpload);
