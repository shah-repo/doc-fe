import { Box } from "@material-ui/core";
import React from "react";
import Colors from "../../layout/theme/utils/colors";
import { FBPartsItemProps } from "./FBPartsItem.types";
import { withFBPartsItem } from "./FBPartsItem.wrap";

const FBParts: React.FunctionComponent<FBPartsItemProps> = ({
  value,
  ...props
}) => (
  <Box
    bgcolor={Colors.light_blue}
    border={1}
    borderColor={Colors.medium_blue}
    borderRadius={4}
    padding={1}
    fontWeight="bold"
    marginBottom={2}
  >
    {`${value.id} - ${value.title} | Qty: ${value.quantity} ${value.unit}`}
  </Box>
);

export default withFBPartsItem(FBParts);
