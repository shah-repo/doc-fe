
import { Box } from "@material-ui/core";
import { isEmpty } from "lodash";
import React from "react";
import Colors from "../../../../layout/theme/utils/colors";
import styles from "./common.styles";

const DetailDescription: React.FunctionComponent<any> = ({
  primaryText,
  secondayText,
  marginBottom,
  includeNameAndEmail,
  userDetails,
}) => {
  const classes = styles();
  return (
    <>
      {includeNameAndEmail &&  !isEmpty(userDetails) &&
       <><Box mb={1.75}>
         <Box
           color={Colors.font_gray}
           fontSize={12}>
           {/* Question: How to check if new user */}
            Added User
         </Box>
         <Box color={Colors.almost_black} fontSize={14} className={classes.description}>
           {userDetails.user.name}
         </Box>
       </Box><Box mb={1.75}>
         <Box
           color={Colors.font_gray}
           fontSize={12}>
             Added Email Address
         </Box>
         <Box color={Colors.almost_black} fontSize={14} className={classes.description}>
           {userDetails.user.email}
         </Box>
       </Box></>
      }
      <Box mb={marginBottom ? 1.75 : 0}>
        <Box
          color={Colors.font_gray}
          fontSize={12}>
          {primaryText}
        </Box>
        <Box color={Colors.almost_black} fontSize={14} className={classes.description}>
          {secondayText}
        </Box>
      </Box>
    </>
  );
};

export default DetailDescription;
