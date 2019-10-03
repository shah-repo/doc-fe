import { Box, FormGroup } from "@material-ui/core";
import React from "react";
import { withLabelRenderer } from "../../hocs/withLabelRenderer";
import { FBCheckboxGroupProps } from "../../types/checkbox";
import FBCheckbox from "./FBCheckbox";

const FBCheckboxGroup: React.FunctionComponent<FBCheckboxGroupProps> = ({
  labelRenderer,
  options,
}) => {

  const optionsRenderer = options.map((option, i) =>
    <FBCheckbox key={`fb.check.${name}.${i}`} {...option} />);

  return (
    <Box mb={4}>
      {labelRenderer}
      <FormGroup row={true}>
        {optionsRenderer}
      </FormGroup>
    </Box>
  );
};

export default withLabelRenderer(FBCheckboxGroup);
