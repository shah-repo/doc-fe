import { Box } from "@material-ui/core";
import React from "react";
import FBOptionsContainer from "../custom/FBOptionsContainer";
import FBCheckbox from "../inputs/FBCheckbox";
import FBLabelEditor from "./FBLabelEditor";

const FBSelectEditor: React.FunctionComponent<{}> = () => (
  <Box>
    <FBLabelEditor />
    <FBOptionsContainer label="form.builder.options" name="options" />
    <FBCheckbox label="form.builder.include.empty" name="includeEmpty" gutter={false} />
    <FBCheckbox label="form.builder.include.other" name="includeOther" />
  </Box>
);

export default FBSelectEditor;
