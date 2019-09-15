import { Box, Button } from "@material-ui/core";
import React from "react";

const FBAddFieldButton: React.FunctionComponent<{}> = ({
  ...props
}) => {

  return (
    <Box display="flex" p={1} m={1}>
      <Box borderTop={3} my="auto" height="1px" width="35%" color="primary.main" />
      <Button color="primary">
        Add Field
      </Button>
      <Box borderTop={3} my="auto" height="1px" width="35%" color="primary.main" />
    </Box>
  );
};

export default FBAddFieldButton;
