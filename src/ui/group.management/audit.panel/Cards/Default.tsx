import { Box } from "@material-ui/core";
import { find, map } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { AuditDetailsProps } from "../../../../state/ducks/userManagement/types";
import Colors from "../../../layout/theme/utils/colors";
import styles from "./card.styles";
import DetailDescription from "./common/detail.description";
import UserAvatarCard from "./common/userAvatar";

interface Props {
  auditDetails:  AuditDetailsProps;
}

const Default: React.FunctionComponent<Props> = ({ auditDetails }) => {
  const { timestamp, ownerDetails, descriptions, companyId } = auditDetails;
  const classes = styles();
  //  For Debugging
  const companyMine = useSelector(authSelectors.employees);
  const getCompanyName = map(companyMine, "company");
  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatarCard timestamp={timestamp} userDetails={ownerDetails} />
        {/* For Debugging */}
        <Box color={Colors.red} fontSize={12}>Comapany:
          {getCompanyName && find(getCompanyName, { id: companyId })?.name}</Box>
        {map(descriptions, (groupItem, index) => (
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
