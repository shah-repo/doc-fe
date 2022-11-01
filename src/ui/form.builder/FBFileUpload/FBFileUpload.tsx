import { isEmpty } from "lodash";
import React from "react";
import { FBFileField, FBFilesPresenter, FBFileUploadProps, FBInput, FBProvider } from "..";
import FBFileFieldIcon from "../FBFileField/FBFileField.icon";
import { FBFontStyle } from "../styles/FBFont.styles";
import { withFBFileUpload } from "./FBFileUpload.wrap";

const FileUploadChild: React.FunctionComponent<FBFileUploadProps> = ({
  name, disabled, files, mode = "fileUpload", readonly = false,
}) =>
  <>
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
  </>;


const FBFileUpload: React.FunctionComponent<FBFileUploadProps> = ({
  fileUploadState,
  ...props
}) =>  (
  <FBProvider {...{ fileUploadState }}>
    <FBInput {...props} type="fileupload" labelProps={FBFontStyle.labelProps}>
      <FileUploadChild  {...props}  />
    </FBInput>
  </FBProvider>
);

export default withFBFileUpload(FBFileUpload);
