import Box from "@material-ui/core/Box";
import { get } from "lodash";
import React from "react";
import { SMLabelFontSize, SMLabelProps, SMText } from "../../..";
import Colors from "../../../../ui/layout/theme/utils/colors";

const SMLabel: React.FunctionComponent<SMLabelProps> = ({
  label,
  error,
  loading,
  fontSize = "md",
  ...boxProps
}) => (
  <Box
    mb={2}
    fontWeight={500}
    color={Colors.dark_gray}
    fontSize={`${get(SMLabelFontSize, fontSize)}.fontSize`}
    {...boxProps}
  >
    <SMText {...{ loading }} locale={label} />
  </Box>
);

export default SMLabel;
