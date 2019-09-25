import { Box } from "@material-ui/core";
import React from "react";
import FBBasicFieldEditor from "./FBBasicFieldEditor";

const FBEditor: React.FunctionComponent<{}> = () => {

  return (
    <Box display="block">
      <FBBasicFieldEditor label="form.builder.basic.fields" />
    </Box>
  );
};

export default FBEditor;
