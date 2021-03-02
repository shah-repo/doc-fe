import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import { hasIn, isString } from "lodash";
import React from "react";
import { FBLabelProps, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
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
      mb={2}
      fontWeight={500}
      color={Colors.dark_gray}
      {...boxProps}
    >
      {isString(label) && (
        <FBText {...{ loading }} locale={label} />
      )}
      {hasIn(label, "locale") && (
        <FBText
          {...{ loading }}
          locale={(label as FBLabelLocaleProps).locale}
          values={(label as FBLabelLocaleProps).values}
        />
      )}
    </Box>
  </FormLabel>
);

export default withFBLabel(FBLabel);
