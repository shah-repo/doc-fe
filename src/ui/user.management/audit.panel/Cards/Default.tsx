import { Box } from "@material-ui/core";
import { map } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
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
  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatar
          timestamp={auditDetails.timestamp}
          ownerEmail={auditDetails.ownerEmail}
          ownerId={auditDetails.ownerId}
          ownerName={auditDetails.ownerName}
        />
        {map(auditDetails.groupItems, (groupItem) => (
          <DetailDescription
            primaryText={getTransalatedText(groupItem.primaryText)}
            secondayText={groupItem.secondayText}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Default;
