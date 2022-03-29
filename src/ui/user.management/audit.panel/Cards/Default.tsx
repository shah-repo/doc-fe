import { Box } from "@material-ui/core";
import { map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import styles from "./card.styles";
import DetailDescription from "./common/detail.description";
import UserAvatar from "./common/userAvatar";

interface Props {
  auditDetails: any;
}

const Default: React.FunctionComponent<Props> = ({ auditDetails }) => {
  const classes = styles();
  const intl = useIntl();
  const getTransalatedText = (key: string) => intl.formatMessage({ id: `user.management.audit.history.${key}` });
  const groupsById = useSelector(userManagementSelectors.groupsById);
  const getGrpNameFromGrpId = (groupId: string) => groupId.split(",").map((obj) => groupsById[obj] ?
    groupsById[obj].name : obj).join(",");
  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatar
          timestamp={getFormattedDateString(
            auditDetails.timestamp,
            MomentFormats.BriefDateTime
          )}
          ownerEmail={auditDetails.ownerEmail}
          ownerId={auditDetails.ownerId}
          ownerName={auditDetails.ownerName}
        />
        {map(auditDetails.groupItems, (groupItem, index) => (
          <DetailDescription
            primaryText={getTransalatedText(groupItem.primaryText)}
            secondayText={groupItem.primaryText === "AddedToGroups" ?
              getGrpNameFromGrpId(groupItem.secondayText) : groupItem.secondayText }
            key={index}
            marginBottom={auditDetails.groupItems.length > 1 && +index % 2 === 0}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Default;
