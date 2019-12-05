import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import React from "react";
import Text from "../../../components/Text";
import { FBLabelProps } from "../../types/common";

const FBLabel: React.FunctionComponent<FBLabelProps> = ({
  label,
  error,
  labelValues,
}) => {
  return (
    <FormLabel component="legend" error={error}>
      <Box mb={0.5} fontSize="h6.fontSize" fontWeight={300}>
        <Text message={label as string} values={labelValues} />
      </Box>
    </FormLabel>
  );
};

export default FBLabel;
