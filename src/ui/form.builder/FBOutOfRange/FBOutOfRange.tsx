import { Box } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import { FBOutOfRangeProps, FBProvider, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBOutOfRange } from "./FBOutOfRange.wrap";

const FBOutOfRange: React.FunctionComponent<FBOutOfRangeProps> = () => (
  <FBProvider>
    <Box display="inline-flex" alignItems="center" >
      <ErrorIcon color="error" />
      <FBText
        locale="form.builder.out.of.range"
        boxProps={{
          pl: 0.5,
          color: Colors.error_red,
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      />
    </Box>
  </FBProvider>
);

export default withFBOutOfRange(FBOutOfRange);
