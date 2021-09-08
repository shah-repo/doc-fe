import { Box } from "@material-ui/core";
import React from "react";
import { FBButton } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBDownloadSheetTplProps } from "..";
import { withFBDownloadSheetTpl } from "./FBDownloadSheetTpl.wrap";

const FBDownloadSheetTpl: React.FunctionComponent<FBDownloadSheetTplProps> = ({
  label,
  name,
  disabled,
  handleAction,
  ...props
}) => (

  <Box display="flex" flexDirection="row">
    <FBButton
      iconType={`download`}
      key={`downloadsheet`}
      label={label}
      variant="contained"
      style={{ margin: "0 0 40px 0", width: "50%", background: Colors.medium_blue, padding: "10px 0" }}
      onClick={() => handleAction?.()}
      {...{ disabled }}
    />
  </Box>
);

export default withFBDownloadSheetTpl(FBDownloadSheetTpl);
