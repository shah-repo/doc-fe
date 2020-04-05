import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import React from "react";
import Text from "../../components/Text";
import { FBLabelProps } from "../FBLabel";
import { withFBLabel } from "./FBLabel.wrap";

const FBLabel: React.FunctionComponent<FBLabelProps> = ({
  label,
  error,
  labelValues,
  loading,
  ...boxProps
}) => (
  <FormLabel component="legend" {...{ error }}>
    <Box
      mb={0.5}
      fontWeight={300}
      {...boxProps}
    >
      <Text message={label as string} values={labelValues} />
      {loading && (
        <Box ml={1} component="span">
          <CircularProgress size={16} />
        </Box>
      )}
    </Box>
  </FormLabel>
);

export default withFBLabel(FBLabel);
