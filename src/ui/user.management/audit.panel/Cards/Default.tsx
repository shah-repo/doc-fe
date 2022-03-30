import { Box } from "@material-ui/core";
import { map } from "lodash";
import React from "react";
import styles from "./card.styles";
import DetailDescription from "./common/detail.description";
import UserAvatarCard from "./common/userAvatar";

interface Props {
  auditDetails: any;
}

const Default: React.FunctionComponent<Props> = ({ auditDetails }) => {
  const classes = styles();
  /*
  const intl = useIntl();
  const getTransalatedText = (key: string, values: any) =>
    intl.formatMessage({ id: `user.management.audit.history.${key}` }, values)
  ;
  */

  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatarCard
          timestamp={auditDetails.timestamp}
          userDetails={auditDetails.ownerDetails}
        />
        {/* Below in secondayText add ${auditDetails.id} at the end for testing only. It should be cleaned up later */}
        {map(auditDetails.descriptions, (groupItem, index) => (
          <DetailDescription
            primaryText={groupItem.primaryText}
            secondayText= {groupItem.secondayText}
            id={auditDetails.id}
            key={index}
            userDetails={auditDetails.employeeDetails}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Default;
