import { Box, Grid } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import SuccessIcon from "@material-ui/icons/CheckCircle";
import { capitalize, isEmpty } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import { FBFileField, FBFilesPresenter, FBFZIPUploadProps, FBInput, FBProvider, FBUnzipStatus } from "..";
import Colors from "../../layout/theme/utils/colors";
import FBButton from "../components/inputs/FBButton";
import { FBFontStyle } from "../styles/FBFont.styles";
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
  fileUploadState,
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
    <Observer>
      {() => (
        <>
          {!isEmpty(files) && (
            <Grid container>
              <Grid item xs={8}>
                <FBFilesPresenter
                  boxProps={{ mt: 2 }}
                  {...{ files, disabled }}
                />
              </Grid>
              <Grid item xs={4} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  {fileUploadState?.unzipStatus &&
                <Box
                  css={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 1.6em",
                    fontWeight: 600,
                    fontSize: "12px",
                    lineHeight: "15px",
                    alignItems: "center",
                  }}
                  color={Colors.almost_black}
                >
                  {fileUploadState?.unzipStatus === FBUnzipStatus.DONE ?
                    <SuccessIcon fontSize="small" style={{ color: Colors.latest_green_varient }} />
                    : (fileUploadState?.unzipStatus === FBUnzipStatus.PROCESSING ?
                      <CachedIcon fontSize="small" style={{ color: Colors.font_gray }} /> : null)
                  }
                  <b style={{ marginLeft: "10px" }}>
                    {fileUploadState?.unzipStatus === FBUnzipStatus.PROCESSING ?
                      `${capitalize(fileUploadState?.unzipStatus)}...` : capitalize(fileUploadState?.unzipStatus)
                    }
                  </b>
                </Box>}
                </Grid>
                <Grid item xs={12} style={{ maxWidth: "fit-content", minWidth: "7.6875em" }}>
                  <FBButton
                    key={`fb-zip-attachment-button-${name}`}
                    label={"form.builder.unzip.files"}
                    onClick={() => { startUnzip(); }}
                    disabled= {disableUnzipButton || disabled}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Observer>
  </>;


const FBZIPUpload: React.FunctionComponent<FBFZIPUploadProps> = ({
  fileUploadState,
  ...props
}) =>  (
  <FBProvider {...{ fileUploadState }}>
    <FBZIPFileSocket docRevisionId={props.docRevisionId} />
    <FBInput labelProps={FBFontStyle.labelProps} {...props} type="zipattachment">
      <ZIPUploadChild  {...props} {...{ fileUploadState }} />
    </FBInput>
  </FBProvider>
);

export default withFBZIPUpload(FBZIPUpload);
