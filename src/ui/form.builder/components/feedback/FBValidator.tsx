import { Box } from "@material-ui/core";
import React from "react";
import { withValidator } from "../../hocs/withValidator";
import { FBValidatorProps } from "../../types/validator";

const FBValidator: React.FunctionComponent<FBValidatorProps> = ({
  children,
}) => (
  <Box
    mb={4}
    border={2}
    borderLeft={0}
    borderRight={0}
    pt={3}
    borderColor="text.hint"
    style={{ borderStyle: "dashed" }}
  >
    {children}
  </Box>
);

export default withValidator(FBValidator);
