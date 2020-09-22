
import { Box } from "@material-ui/core";
import React from "react";
import { FBTextProps } from "..";
import Text from "../../components/Text";

const FBText: React.FunctionComponent<FBTextProps> = ({
  boxProps,
  locale,
  values,
}) => (
  <Box {...boxProps} data-cy={locale}>
    <Text message={locale} {...{ values }} />
  </Box>
);

export default FBText;
