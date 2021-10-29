import { Grid } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { FBFileField, FBFilesPresenter, FBInput, FBProvider } from "..";
import FBButton from "../components/inputs/FBButton";
import { FBFZIPUploadProps } from "./FBZIPUpload.types";
import { withFBZIPUpload } from "./FBZIPUpload.wrap";

const ZIPUploadChild: React.FunctionComponent<FBFZIPUploadProps> = ({
  name,
  disabled,
  files,
  readonly = false,
  disableFileUpload = false,
}) =>
  <>
    {!readonly && (
      <FBFileField
        key={`fb-zip-attachment-field-${name}`}
        name={name}
        disabled= {disableFileUpload || disabled}
        typeToAccept=".zip"
      />
    )}
    {!isEmpty(files) && (
      <Grid container>
        <Grid item xs={8}>
          <FBFilesPresenter
            boxProps={{ mt: 2 }}
            {...{ files, disabled }}
          />
        </Grid>
        <Grid item xs={4} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <FBButton
            key={`fb-zip-attachment-button-${name}`}
            label={"form.builder.unzip.files"}
            onClick={() => { return; }}
            {...{ disabled }}
          />
        </Grid>
      </Grid>
    )}
  </>;


const FBZIPUpload: React.FunctionComponent<FBFZIPUploadProps> = ({
  fileUploadState,
  ...props
}) =>  (
  <FBProvider {...{ fileUploadState }}>
    <FBInput {...props} type="zipupload">
      <ZIPUploadChild  {...props}  />
    </FBInput>
  </FBProvider>
);

export default withFBZIPUpload(FBZIPUpload);
