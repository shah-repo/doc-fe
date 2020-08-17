import { Box } from "@material-ui/core";
import React from "react";
import { FBSectionProps } from "..";
import Text from "../../components/Text";

const FBSubsection: React.FunctionComponent<FBSectionProps> = ({
  label,
  gutter = true,
}) => (
  <Box
    py={1.5}
    px={2}
    fontSize="h6.fontSize"
    fontWeight={100}
    borderColor="text.hint"
    border={1}
    borderLeft={0}
    borderRight={0}
    mb={gutter ? 4 : 0}
  >
    {label && <Text message={(label as string).toUpperCase()} />}
  </Box>
);

export default FBSubsection;
