import { Box } from "@material-ui/core";
import React from "react";
import styles from "./card.styles";
import DetailDescription from "./common/detail.description";
import UserAvatar from "./common/userAvatar";

const EmployeeDeactivated: React.FunctionComponent = () => {
  const classes = styles();
  return (
    <Box width={"100%"} fontFamily="Sora" className={classes.outerContainer}>
      <Box display="grid">
        <UserAvatar />
        <DetailDescription text={"text"} marginBottom={true} />
        <DetailDescription text={"text"} />
      </Box>
    </Box>
  );
};

export default EmployeeDeactivated;

