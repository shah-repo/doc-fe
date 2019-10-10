import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBFormDefaultProps } from "../../types/common";

const FBSubSectionBox: React.FunctionComponent<FBFormDefaultProps> = ({
  label,
}) => {
  return (
    <Box
      mb={4}
      py={1.5}
      px={2}
      fontSize="h6.fontSize"
      fontWeight={100}
      borderBottom={1}
      borderTop={1}
    >
      <Text message={label!.toUpperCase()} />
    </Box>
  );
};

export default FBSubSectionBox;
