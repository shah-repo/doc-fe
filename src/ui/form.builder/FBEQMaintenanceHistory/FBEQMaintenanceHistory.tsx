import { Box } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBEQMaintenanceHistoryProps, FBMapWrapper } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Colors from "../../layout/theme/utils/colors";
import { withFBEQMaintenanceHistory } from "./FBEQMaintenanceHistory.wrap";

const FBEQMaintenanceHistory: React.FunctionComponent<FBEQMaintenanceHistoryProps> = ({
  maintenanceHistory,
  ...props
}) => (
  <Box mb={5} fontWeight="fontWeightBold">
    <Box display="flex" alignItems="center" mb={1}>
      Maintenance History
      <ArrowDropDownIcon />
    </Box>
    <FBMapWrapper<DocumentRevision[]> collection={maintenanceHistory}>
      {(item: DocumentRevision, index) => (
        <Box display="flex" flexDirection="row">
          <Box color={Colors.medium_blue} mr={0.5}>
            {item.document?.docId} - {item.name}
          </Box>
          <Box fontWeight="fontWeightRegular">
            | {item.owner.user.name}
            | {item.status}
            | { item.releasedAt && getFormattedDateString(item.releasedAt, MomentFormats.MonthDateYearAlt)}
          </Box>
        </Box>
      )}
    </FBMapWrapper>

  </Box>
);

export default withFBEQMaintenanceHistory(FBEQMaintenanceHistory);
