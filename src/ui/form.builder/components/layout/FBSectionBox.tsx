import { Box } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import { FBFormDefaultProps } from "../../types/common";

const FBSectionBox: React.FunctionComponent<FBFormDefaultProps> = ({
  label,
}) => {
  return (
    <Box
      mb={4}
      bgcolor="primary.main"
      color="primary.contrastText"
      py={1.5}
      px={2}
      fontSize="h6.fontSize"
      fontWeight={100}
    >
      <Text message={label!.toUpperCase()} />
    </Box>
  );
};

export default FBSectionBox;
