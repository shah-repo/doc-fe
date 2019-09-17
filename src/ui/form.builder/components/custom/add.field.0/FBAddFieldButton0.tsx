import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";

const FBAddFieldButton0: React.FunctionComponent<{}> = ({
  ...props
}) => {

  return (
    <Box
      display="flex"
      m={1}
      border={1}
      style={{ borderStyle: "dashed" }}
    >
      <Button
        color="primary"
        fullWidth={true}
      >
        <Text translation="form.builder.add.field" />
      </Button>
    </Box>
  );
};

export default FBAddFieldButton0;
