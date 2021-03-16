import { isEmpty } from "lodash";
import React from "react";
import { FBFileField, FBFilesPresenter, FBFileUploadProps, FBInput, FBProvider } from "..";
import FBAttachmentShortcut from "../FBFileField/FBAttachmentShortcut";
import { withFBFileUpload } from "./FBFileUpload.wrap";

const FBFileUpload: React.FunctionComponent<FBFileUploadProps> = ({
  disabled,
  name,
  fileUploadState,
  readonly = false,
  files,
  attachmentShortcut = false,
  gutter,
  ...props
}) =>  (
  <FBInput {...props} {...{ name, gutter }} type="fileupload">
    <FBProvider {...{ fileUploadState }}>
      {!readonly && !attachmentShortcut && (
        <FBFileField key={`fb-attachment-field-${name}`} {...{ name, disabled }} />
      )}
      {attachmentShortcut && <FBAttachmentShortcut key={`fb-attachment-field-${name}`} {...{ name, disabled }} /> }
      {!attachmentShortcut && !isEmpty(files) && (
        <FBFilesPresenter
          boxProps={{ mt: 2 }}
          {...{ files, disabled }}
        />
      )}
    </FBProvider>
  </FBInput>
);

export default withFBFileUpload(FBFileUpload);
