import { Box } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { get } from "lodash";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Link } from "react-router-dom";
import { FBMapWrapper, FBText } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { documentVersionPath } from "../../document.revision/utils/paths";
import Colors from "../../layout/theme/utils/colors";

interface FBEQMaintenanceHistoryProps {
  maintenanceHistory?: DocumentRevision[];
}

const FBEQMaintenanceHistory: React.FC<FBEQMaintenanceHistoryProps> = ({
  maintenanceHistory = [],
}) => (
  <Box mb={5} fontWeight="fontWeightBold">
    <Box display="flex" alignItems="center" mb={1}>
      <FBText
        locale={"document.revision.history"}
      />
      <ArrowDropDownIcon />
    </Box>
    <FBMapWrapper<DocumentRevision[]> collection={maintenanceHistory}>
      {(item: DocumentRevision, index) => {
        const showDate = get(item.formInput, "fb-equipment_due_date") || item.releasedAt;
        return (
          <Box data-cy="maintenanceHistory" display="flex" flexDirection="row" key={`fb-eq-${index}`}>
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
              {showDate && item.status === DocumentRevisionStatus.Released
              && `| ${getFormattedDateString(showDate, MomentFormats.MonthDateYearAlt)}`}
              {item.createdAt && item.status !== DocumentRevisionStatus.Released
              && `| ${getFormattedDateString(item.createdAt, MomentFormats.MonthDateYearAlt)}`}
            </Box>
          </Box>
        ); }
      }
    </FBMapWrapper>
  </Box>
);

export default FBEQMaintenanceHistory;
