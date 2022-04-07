
import { Box } from "@material-ui/core";
import React from "react";
import Colors from "../../../../layout/theme/utils/colors";
import styles from "./common.styles";

interface OwnProps {
  primaryText: string;
  secondayText: string;
  groupId: string;
  // TODO: Update
  employeeDetail: any;
}

const DetailDescription: React.FunctionComponent<OwnProps> = ({
  primaryText,
  secondayText,
  groupId,
  employeeDetail,
}) => {
  const classes = styles();
  return (
    <>
      <Box
        color={Colors.font_gray}
        fontSize={12}>
        {primaryText}
      </Box>
      <Box color={Colors.almost_black} fontSize={14} className={classes.description} whiteSpace={"wrap"}>
        {secondayText}
      </Box>
      <Box color={Colors.red} fontSize={6}>
        {groupId}
      </Box>
    </>
  );
};

export default DetailDescription;
