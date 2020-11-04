import { Box } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBEQMaintenanceHistoryProps } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBEQMaintenanceHistory } from "./FBEQMaintenanceHistory.wrap";

const FBEQMaintenanceHistory: React.FunctionComponent<FBEQMaintenanceHistoryProps> = ({
  ...props
}) => (
  <Box mb={5} fontWeight="fontWeightBold">
    <Box display="flex" alignItems="center" mb={1}>
      Maintenance History
      <ArrowDropDownIcon />
    </Box>
    <Box display="flex" flexDirection="row">
      <Box color={Colors.medium_blue} mr={0.5}>
        PM-000020 - Microscope PM
      </Box>
      <Box fontWeight="fontWeightRegular">
        | Bob Jones | Work in Progress
      </Box>
    </Box>
  </Box>
);

export default withFBEQMaintenanceHistory(FBEQMaintenanceHistory);
