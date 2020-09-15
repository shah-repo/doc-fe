
import { Box } from "@material-ui/core";
import React from "react";
import { FBTextProps } from "..";
import Text from "../../components/Text";

const FBText: React.FunctionComponent<FBTextProps> = ({
  boxProps,
  prefix,
  suffix,
  locale,
}) => (
  <Box {...boxProps} data-cy={locale}>
    {prefix}
    <Text message={locale} />
    {suffix}
  </Box>
);

export default FBText;
