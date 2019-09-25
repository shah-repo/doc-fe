import { Box, Grid } from "@material-ui/core";
import React from "react";
import FBEditor from "../editor/FBEditor";
import FBRenderForm from "../form/FBRenderForm";

const FBTemplateForm: React.FunctionComponent<{}> = () => {
  return (
    <Box px={3}>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={3}>
          <FBEditor />
        </Grid>
        <Grid item={true} xs={9} sm={8} md={6}>
          <FBRenderForm />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FBTemplateForm;
