import { Box } from "@material-ui/core";
import { map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../../common/utils/date";
import { companySelectors } from "../../../../state/ducks/company";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import styles from "./card.styles";
import DetailDescription from "./common/detail.description";
import UserAvatarCard from "./common/userAvatar";

interface Props {
  auditDetails: any;
}

const Default: React.FunctionComponent<Props> = ({ auditDetails }) => {
  const classes = styles();
  const intl = useIntl();
  const getTransalatedText = (key: string, values: any) =>
    console.log("debug :: values :: ", values);
  intl.formatMessage({ id: `user.management.audit.history.${key}` }, values)
  ;
  const groupsById = useSelector(userManagementSelectors.groupsById);
  const getGrpNameFromGrpId = (groupId: string) => groupId.split(",").map((obj) => groupsById[obj] ?
    groupsById[obj].name : obj).join(",");

  const companyEmployesUserAvatarInfo = useSelector(companySelectors.getActiveEmployeesForUserAvatar);
  const userAvatarDetails = companyEmployesUserAvatarInfo.find((obj) => obj.id === auditDetails.ownerId);

  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatarCard
          timestamp={getFormattedDateString(
            auditDetails.timestamp,
            MomentFormats.BriefDateTime
          )}
          ownerEmail={auditDetails.ownerEmail}
          ownerId={auditDetails.ownerId}
          ownerName={auditDetails.ownerName}
          avatar={userAvatarDetails?.user?.avatar} initialColor={userAvatarDetails?.user?.initialColor} name={userAvatarDetails?.user?.name}
        />
        {/* Below in secondayText add ${auditDetails.id} at the end for testing only. It should be cleaned up later */}
        {map(auditDetails.groupItems, (groupItem, index) => (
          <DetailDescription
            primaryText={getTransalatedText(groupItem.primaryText, { employeeName: groupItem.employeeName || auditDetails.nextValue })}
            secondayText={`${["AddedToGroups", "DeletedFromGroup"].includes(groupItem.primaryText)  ?
              getGrpNameFromGrpId(groupItem.secondayText) : groupItem.secondayText } ${auditDetails.id}`}
            key={index}
            marginBottom={auditDetails.groupItems.length > 1 && +index % 2 === 0}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Default;
