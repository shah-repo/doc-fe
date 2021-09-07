import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { GetApp } from "@material-ui/icons";
import React from "react";
import { FBInput } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBDownloadSheetTplProps } from "./FBDownloadSheetTpl.types";
import { withFBDownloadSheetTpl } from "./FBDownloadSheetTpl.wrap";

const FBDownloadSheetTpl: React.FunctionComponent<FBDownloadSheetTplProps> = ({
  label,
  name,
  disabled,
  handleAction,
  ...props
}) => (
  <FBInput {...props} {...{ name }} type="downloadsheet">
    <Button
      id="downloadsheet"
      color="secondary"
      variant="contained"
      onClick={() => handleAction?.()}
      style={{ background: Colors.medium_blue, width: "50%", padding: "10px 0" }}
    >
      <Box display="flex" flexDirection="row">
        <GetApp width={20} height={20} style={{ marginRight: 4 }}/>
        <Box style={{ fontSize: "14px", textTransform: "capitalize" }}>{label}</Box>
      </Box>
    </Button>
  </FBInput>
);

export default withFBDownloadSheetTpl(FBDownloadSheetTpl);
