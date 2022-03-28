import { Box } from "@material-ui/core";
import React from "react";
import styles from "./card.styles";
import DetailDescription from "./common/detail.description";
import UserAvatar from "./common/userAvatar";

interface Props {
  details: any;
}

const EmployeeNameUpdated: React.FunctionComponent<Props> = ({ details }) => {
  const classes = styles();
  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatar timestamp={details.timestamp} user={details.actionBy} />
        <DetailDescription primaryText={"Username update"} secondayText={`${details.previousValue} to ${details.nextValue}`} />
      </Box>
    </Box>
  );
};

export default EmployeeNameUpdated;
