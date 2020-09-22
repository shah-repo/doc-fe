import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import { hasIn, isString } from "lodash";
import React from "react";
import { FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBLabelProps } from "../FBLabel";
import { FBLabelLocaleProps } from "./FBLabel.types";
import { withFBLabel } from "./FBLabel.wrap";

const FBLabel: React.FunctionComponent<FBLabelProps> = ({
  label,
  error,
  loading,
  ...boxProps
}) => (
  <FormLabel component="legend" {...{ error }}>
    <Box
      mb={0.5}
      fontWeight={400}
      color={Colors.dark_gray}
      {...boxProps}
    >
      {isString(label) && (
        <FBText locale={label} />
      )}
      {hasIn(label, "locale") && (
        <FBText
          locale={(label as FBLabelLocaleProps).locale}
          values={(label as FBLabelLocaleProps).values}
        />
      )}
      {loading && (
        <Box ml={1} component="span">
          <CircularProgress size={16} />
        </Box>
      )}
    </Box>
  </FormLabel>
);

export default withFBLabel(FBLabel);
