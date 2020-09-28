
import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBTextProps } from "..";
import Text from "../../components/Text";

const FBText: React.FunctionComponent<FBTextProps> = ({
  boxProps,
  loading,
  locale,
  values,
}) => (
  <Box {...boxProps} data-cy={locale} flexDirection="row">
    <Box display="flex">
      <Text message={locale} {...{ values }} />
      {loading && (
        <Box ml={1} mt={0.3}>
          <CircularProgress color="inherit" size={16} />
        </Box>
      )}
    </Box>
  </Box>
);

export default FBText;
