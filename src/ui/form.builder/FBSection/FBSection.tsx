import { Box } from "@material-ui/core";
import React from "react";
import { FBSectionProps } from ".";
import Text from "../../components/Text";

const FBSection: React.FunctionComponent<FBSectionProps> = ({
  label,
  gutter = true,
  stepIndex,
}) => (
  <Box
    bgcolor="primary.main"
    color="primary.contrastText"
    py={1.5}
    px={2}
    fontSize="h6.fontSize"
    fontWeight={100}
    mb={gutter ? 4 : 0}
  >
    {label && <Text message={(label as string).toUpperCase()} />}
    {stepIndex && ` #${stepIndex}`}
  </Box>
);

export default FBSection;
