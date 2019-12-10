import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import React from "react";
import Text from "../../../components/Text";
import { FBLabelProps, FBLabelFontSize } from "../../types/common";

const FBLabel: React.FunctionComponent<FBLabelProps> = ({
  label,
  error,
  labelValues,
  fontSize = "md",
  ...boxProps
}) => (
  <FormLabel component="legend" error={error}>
    <Box
      mb={0.5}
      fontSize={`${FBLabelFontSize[fontSize]}.fontSize`}
      fontWeight={300}
      {...boxProps}
    >
      <Text message={label as string} values={labelValues} />
    </Box>
  </FormLabel>
);

export default FBLabel;
