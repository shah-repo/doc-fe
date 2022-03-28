import { Box } from "@material-ui/core";
import { map } from "lodash";
import React from "react";
import styles from "./card.styles";
import DetailDescription from "./common/detail.description";
import UserAvatar from "./common/userAvatar";

interface Props {
  auditDetails: any;
}

const Default: React.FunctionComponent<Props> = ({ auditDetails }) => {
  const classes = styles();
  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatar timestamp={auditDetails.timestamp} ownerEmail={auditDetails.ownerEmail} ownerId={auditDetails.ownerId} ownerName={auditDetails.ownerName} />
        {map(auditDetails.groupItems, (groupItem) => {
          if (groupItem.action === "AddedToGroups") {
            return <DetailDescription primaryText={"Added to Group"} secondayText={groupItem.items.join(",")} />;
          }
          if (groupItem.action === "CreatedNewUser") {
            return <DetailDescription primaryText={"Added a New User"} secondayText={groupItem.items.join(",")} />;
          }
          if (groupItem.action === "EmployeeNameUpdated") {
            return <DetailDescription primaryText={"Username updated"} secondayText={groupItem.items.join(",")} />;
          }
          if (groupItem.action === "DeactivateUser") {
            return <DetailDescription primaryText={"Deactivated User"} secondayText={groupItem.items.join(",")} />;
          }
          if (groupItem.action === "ActivateUser") {
            return <DetailDescription primaryText={"Activated User"} secondayText={groupItem.items.join(",")} />;
          }
          return <DetailDescription primaryText={"Unknown"} />;
        })}

      </Box>
    </Box>
  );
};

export default Default;
