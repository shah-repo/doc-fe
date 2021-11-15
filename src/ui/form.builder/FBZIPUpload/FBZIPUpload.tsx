import { Box, Grid } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import { FBFileField, FBFilesPresenter, FBFZIPUploadProps, FBInput, FBProvider } from "..";
import FBButton from "../components/inputs/FBButton";
import FBZIPFileSocket from "./FBZIPFile.socket";
import { withFBZIPUpload } from "./FBZIPUpload.wrap";


const ZIPUploadChild: React.FunctionComponent<FBFZIPUploadProps> = ({
  name,
  disabled,
  files,
  readonly = false,
  disableFileUpload = false,
  disableUnzipButton = false,
  unzipStatus,
  startUnzip,
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
          <Box>
            {unzipStatus}
          </Box>
          <FBButton
            key={`fb-zip-attachment-button-${name}`}
            label={"form.builder.unzip.files"}
            onClick={() => { startUnzip(); }}
            disabled= {disableUnzipButton || disabled}
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
    <FBZIPFileSocket docRevisionId={props.docRevisionId} />
    <FBInput {...props} type="zipattachment">
      <ZIPUploadChild  {...props}  />
    </FBInput>
  </FBProvider>
);

export default withFBZIPUpload(FBZIPUpload);
