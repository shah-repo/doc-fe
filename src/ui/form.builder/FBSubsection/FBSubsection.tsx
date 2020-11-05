import { Box } from "@material-ui/core";
import React from "react";
import { FBInput, FBSectionProps } from "..";
import Text from "../../components/Text";

const FBSubsection: React.FunctionComponent<FBSectionProps> = ({
  label,
  showErrorMsg = false,
  omitFinalValidation = true,
  ...props
}) => (
  <FBInput {...props} {...{ showErrorMsg, omitFinalValidation }}>
    <Box
      py={1.5}
      px={2}
      fontSize="h6.fontSize"
      fontWeight={100}
      borderColor="text.hint"
      border={1}
      borderLeft={0}
      borderRight={0}
    >
      {label && <Text message={(label as string).toUpperCase()} />}
    </Box>
  </FBInput>
);

export default FBSubsection;
