import { Box, Grid } from "@material-ui/core";
import React from "react";
import { LiveEditor, LiveError, LiveProvider } from "react-live";
import { withValidatorCustom } from "../../hocs/validation/withValidatorCustom";
import { FBValidatorDynamicProps } from "../../types/validation/validatorDialog";
import FBTextField from "../inputs/FBTextField";
import FBValidatorTree from "./FBValidatorTree";

const FBValidatorCustom: React.FunctionComponent<FBValidatorDynamicProps> = ({
  code,
  scope,
  transformCode,
  onMessageChange,
  errorMessage,
  clear,
}) => (
  <Grid container spacing={3}>
    <Grid item xs={8}>
      <FBTextField
        label="form.builder.error.message"
        defaultValue={errorMessage}
        onChange={onMessageChange}
      />
      <LiveProvider {...{ code, scope, transformCode }}>
        <Box bgcolor="black">
          <LiveEditor />
        </Box>
        <LiveError />
      </LiveProvider>
    </Grid>
    <Grid item xs={4}>
      <FBValidatorTree />
    </Grid>
  </Grid>
);

export default withValidatorCustom(FBValidatorCustom);
