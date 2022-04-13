import { Box } from "@material-ui/core";
import { map } from "lodash";
import React from "react";
import { AuditDetailsProps } from "../../../../state/ducks/userManagement/types";
import styles from "./card.styles";
import DetailDescription from "./common/detail.description";
import UserAvatarCard from "./common/userAvatar";

interface Props {
  auditDetails:  AuditDetailsProps;
}

const Default: React.FunctionComponent<Props> = ({ auditDetails }) => {
  const classes = styles();
  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatarCard timestamp={auditDetails.timestamp} userDetails={auditDetails.ownerDetails} />
        {map(auditDetails.descriptions, (groupItem, index) => (
          <DetailDescription
            key={index}
            primaryText={groupItem.primaryText}
            secondaryText={groupItem.secondaryText}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Default;
