
import { Box } from "@material-ui/core";
import React from "react";
import Colors from "../../../../layout/theme/utils/colors";
import styles from "./common.styles";

const DetailDescription: React.FunctionComponent<any> = ({
  primaryText,
  secondayText,
  marginBottom,
  multitypo,
}) => {
  const classes = styles();
  return (
    <Box mb={marginBottom ? 1.75 : 0}>
      <Box
        color={Colors.font_gray}
        fontSize={12}>
        {primaryText}
      </Box>
      {!multitypo && <Box color={Colors.almost_black} fontSize={14} className={classes.description} >
        {secondayText}
      </Box>}
    </Box>
  );
};

export default DetailDescription;
