import { Box } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBProcedureAssetActionLocale, FBProcedureAssetLocale, FBProcedureAssetProps, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBProcedureAsset } from "./FBProcedureAsset.wrap";

const FBProcedureAsset: React.FunctionComponent<FBProcedureAssetProps> = ({
  type,
}) => (
  <Box
    bgcolor={Colors.gray}
    color="white"
    style={{ borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }}
    fontWeight="fontWeightBold"
    display="flex"
  >
    <FBText
      boxProps={{ flexGrow: 1, pt: 2, pl: 2 }}
      locale={FBProcedureAssetLocale[type]}
    />
    <FBButton
      variant="text"
      color="inherit"
      startIcon={<AddCircleIcon />}
      label={FBProcedureAssetActionLocale[type]}
    />
  </Box>
);

export default withFBProcedureAsset(FBProcedureAsset);
