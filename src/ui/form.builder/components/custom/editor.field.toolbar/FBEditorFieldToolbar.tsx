import { Box, Button } from "@material-ui/core";
import React from "react";

const FBEditorFieldToolbar: React.FunctionComponent<{}> = ({
  ...props
}) => {

  return (
    <Box display="flex" flexDirection="row-reverse" m={1}>
      <Button>
        Edit
      </Button>
      <Button>
        Delete
      </Button>
    </Box>
  );
};

export default FBEditorFieldToolbar;
