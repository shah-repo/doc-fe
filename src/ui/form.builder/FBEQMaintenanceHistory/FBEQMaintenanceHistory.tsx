import { Box } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { get } from "lodash";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Link } from "react-router-dom";
import { FBEQMaintenanceHistoryProps, FBMapWrapper, FBText } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { documentVersionPath } from "../../document.revision/utils/paths";
import Colors from "../../layout/theme/utils/colors";
import { withFBEQMaintenanceHistory } from "./FBEQMaintenanceHistory.wrap";

const FBEQMaintenanceHistory: React.FunctionComponent<FBEQMaintenanceHistoryProps> = ({
  maintenanceHistory = [],
  ...props
}) => (
  <Box mb={5} fontWeight="fontWeightBold">
    <Box display="flex" alignItems="center" mb={1}>
      <FBText
        locale={"form.builder.maintenance.history"}
      />
      <ArrowDropDownIcon />
    </Box>
    <FBMapWrapper<DocumentRevision[]> collection={maintenanceHistory}>
      {(item: DocumentRevision, index) => {
        const dueDate = get(item.formInput, "fb-equipment_due_date");
        return (
          <Box display="flex" flexDirection="row" key={`fb-eq-${index}`}>
            <Box color={Colors.medium_blue} mr={0.5}>
              <Link
                to={documentVersionPath(item.id, item.document?.id )}
                target="_blank"
              >
                {item.document?.docId} - {item.name}
              </Link>
            </Box>
            <Box fontWeight="fontWeightRegular">
            | {item.owner.user.name}
            | {item.status}
              {dueDate && `| ${getFormattedDateString(dueDate, MomentFormats.MonthDateYearAlt)}`}
            </Box>
          </Box>
        ); }
      }
    </FBMapWrapper>

  </Box>
);

export default withFBEQMaintenanceHistory(FBEQMaintenanceHistory);
