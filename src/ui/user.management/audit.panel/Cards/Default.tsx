import { Box } from "@material-ui/core";
import { map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
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
    // console.log("debug :: values :: ", values);
    intl.formatMessage({ id: `user.management.audit.history.${key}` }, values)
  ;

  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatarCard
          timestamp={auditDetails.timestamp}
          userDetails={auditDetails.ownerDetails}
        />
        {/* Below in secondayText add ${auditDetails.id} at the end for testing only. It should be cleaned up later */}
        {map(auditDetails.groupItems, (groupItem, index) => (
          <DetailDescription
            primaryText={getTransalatedText(groupItem.primaryText, { employeeName: groupItem.employeeName || auditDetails.nextValue })}
            secondayText= {`${groupItem.secondayText}  ${auditDetails.id}`}
            key={index}
            marginBottom={auditDetails.groupItems.length > 1 && +index % 2 === 0}
            includeNameAndEmail={groupItem.includeNameAndEmail}
            userDetails={auditDetails.employeeDetails}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Default;
