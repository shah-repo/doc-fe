import { Box } from "@material-ui/core";
import React from "react";
import { FBInput, FBSectionProps } from "..";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";

const FBSubsection: React.FunctionComponent<FBSectionProps> = ({
  label,
  showErrorMsg = false,
  omitFinalValidation = true,
  ...props
}) => (
  <FBInput {...props} {...{ showErrorMsg, omitFinalValidation }}>
    <Box
      py={0.75}
      pr={0}
      pl={1.25}
      bgcolor={Colors.whitest_grey}
      borderRadius={4}
      fontSize={14}
      lineHeight="24px"
      fontWeight={600}
    >
      {label && <Text message={(label as string).toUpperCase()} />}
    </Box>
  </FBInput>
);

export default FBSubsection;
