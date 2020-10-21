import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import React from "react";
import Text from "../../../components/Text";
import { FBLabelFontSize, FBLabelProps } from "../../types/common";

const FBLabel: React.FunctionComponent<FBLabelProps> = ({
  label,
  error,
  fontSize = "md",
  loading,
  ...boxProps
}) => (
  <FormLabel component="legend" error={error}>
    <Box
      mb={0.5}
      fontSize={`${FBLabelFontSize[fontSize]}.fontSize`}
      fontWeight={300}
      {...boxProps}
    >
      <Text message={label as string} />
      {loading && (
        <Box ml={1} component="span">
          <CircularProgress size={15} />
        </Box>
      )}
    </Box>
  </FormLabel>
);

export default FBLabel;
